// https://unpkg.com/three
// version @0.126.1 seems to work
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';


function makeAllLines() {
    var DIMENSIONS = {
        x: 17,
        y: 8,
        z: 18,
    }
    var LINES = {
        x: [],
        y: [],
        z: [],
    }
    // All lines
    for (let axis of Object.keys(LINES)) {
        let dimensions = []
        for (let d of Object.keys(DIMENSIONS)) {
            if (d != axis) dimensions.push(DIMENSIONS[d])
        }
        for (let i = 0; i < dimensions[0]; i++) {
            for (let j = 0; j < dimensions[1]; j++) {
                switch (axis) {
                    case "x": LINES[axis].push([
                            [0,i,j],
                            [DIMENSIONS[axis]-1,i,j],
                        ])
                        break
                    case "y": LINES[axis].push([
                            [i,0,j],
                            [i,DIMENSIONS[axis]-1,j],
                        ])
                        break
                    case "z": LINES[axis].push([
                            [i,j,0],
                            [i,j,DIMENSIONS[axis]-1],
                        ])
                        break
                    default:
                        break;
                }
            }
        }
    }
}

function makeRectangleGrid(corner, dimensions, side) {
    let other_axis = "xyz".replace(side[0], '').replace(side[1], '')

    let lines = []
    for (let axis of side) {
        let line_axis = side.replace(axis, '')
        for (let i = 0; i < dimensions[axis]; i++) {
            let p0 = {}
            p0[axis]        = corner[axis] + i
            p0[line_axis]   = corner[line_axis]
            p0[other_axis]  = corner[other_axis]

            let p1 = {}
            p1[axis]        = corner[axis] + i
            p1[line_axis]   = corner[line_axis] + dimensions[line_axis]-1
            p1[other_axis]  = corner[other_axis]

            lines.push([
                [p0.x, p0.y, p0.z],
                [p1.x, p1.y, p1.z],
            ])
        }
    }
    return lines
}

function makeSides(dimensions) {
    let sides = {
        xy: [],
        xz: [],
        yz: [],
        xyo: [],
        xzo: [],
        yzo: [],
    }
    for (let side of Object.keys(sides)) {
        let corner = {x:0,y:0,z:0}
        if (side[2] == 'o') {
            let other_axis = "xyz".replace(side[0], '').replace(side[1], '')
            corner[other_axis] = dimensions[other_axis]-1
        }
        sides[side] = makeRectangleGrid(
            corner,
            dimensions,
            side.replace('o', '')
        )
    }
    return sides
}

const tempV = new THREE.Vector3()
const raycaster = new THREE.Raycaster()


class CanvasRenderer {
    constructor(box_size=.1, dimensions) {
        document.value = this
        let canvas = this.init_canvas()
        this.canvas = canvas
        this.label_container = document.querySelector("#labels")

        this.renderer = new THREE.WebGLRenderer({canvas}) //?
        // this.renderer.setSize( window.innerWidth, window.innerHeight )
        // document.body.appendChild(this.renderer.domElement)
        this.camera = this.init_camera(dimensions)
        this.scene = this.init_scene()
        this.orbit_controls = new OrbitControls( this.camera, this.renderer.domElement )
        this.orbit_controls.target = new THREE.Vector3(dimensions.x/2, 0, dimensions.z/2)
        this.orbit_controls.update()

        this.box_geometry = new THREE.BoxGeometry(box_size, .2, box_size)
        this.box_material = new THREE.MeshPhongMaterial({color:0xff0000})
        this.gridline_material = new THREE.LineBasicMaterial({color:0xaabbcc})
        this.line_material = new THREE.LineBasicMaterial({color:0x0000ff})

        this.boxes = []
        this.labels = []

        // this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.run)
        // this.handle_run = (time_stamp) => { this.run(time_stamp) }
    }

    init_canvas() {
        // Create canvas
        // let canvas = document.createElement("canvas")
        // document.body.appendChild(canvas)
        let canvas = document.querySelector("#c")
        canvas.style["width"] = "100%"
        canvas.height = canvas.offsetHeight
        canvas.width = canvas.offsetWidth
        return canvas
    }

    init_camera(dimensions) {
        let fov = 45
        let aspect = this.canvas.width / this.canvas.height
        let near = 0.1
        let far = 100
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(dimensions.x,dimensions.y,dimensions.z)
        return camera
    }

    init_scene() {
        let scene = new THREE.Scene()
        let color = 0xFFFFFF
        let intensity = 1
        let light = new THREE.DirectionalLight(color, intensity*2)
        light.position.set(-1, 2, 4)
        scene.add(light)
        let light2 = new THREE.DirectionalLight(color, intensity)
        light2.position.set(1, -2, -4)
        scene.add(light2)
        return scene
    }

    add_box(x, y, z, name=null) {
        let box = new THREE.Mesh(this.box_geometry, this.box_material)
        box.position.set(x,y,z)

        let div = null
        if (name) {
            div = document.createElement('div')
            div.textContent = name
            this.label_container.appendChild(div)
        }

        this.scene.add(box)
        this.boxes.push(box)
        this.labels.push(div)
        return box
    }

    add_boxes(boxes) {
        let i = 1
        for (let box of boxes) {
            this.add_box(box[0], box[1], box[2], i.toString())
            i++
        }
    }

    add_line(points, gridline=false) {
        let vectors = []
        for (let p of points) {
            vectors.push(new THREE.Vector3(p[0], p[1], p[2]))
        }
        let geometry = new THREE.BufferGeometry().setFromPoints( vectors )
        let material = this.line_material
        if (gridline) {
            material = this.gridline_material
        }
        let line = new THREE.Line( geometry, material )

        this.scene.add(line)
        return line
    }

    run(time_stamp) {
        let thi = document.value

        // required if controls.enableDamping or controls.autoRotate are set to true
        // thi.orbit_controls.update()

        thi.renderer.render(thi.scene, thi.camera)

        // Add labels
        thi.boxes.forEach((box, i) => {
            let div = thi.labels[i]

            if (!div) {
                return
            }

            // get the position of the center of the cube
            box.updateWorldMatrix(true, false)
            box.getWorldPosition(tempV)

            // get the normalized screen coordinate of that position
            // x and y will be in the -1 to +1 range with x = -1 being
            // on the left and y = -1 being on the bottom
            tempV.project(thi.camera)

            // ask the raycaster for all the objects that intersect
            // from the eye toward this object's position
            raycaster.setFromCamera(tempV, thi.camera)
            // const intersectedObjects = raycaster.intersectObjects(thi.scene.children)
            const intersectedObjects = raycaster.intersectObjects(thi.boxes)
            // We're visible if the first intersection is this object.
            const show = intersectedObjects.length && box === intersectedObjects[0].object

            if (!show) {
                // hide the label
                div.style.display = 'none'
            } else {
                // un-hide the label
                div.style.display = ''
            }

            // convert the normalized position to CSS coordinates
            let x = (tempV.x *  .5 + .5) * thi.canvas.clientWidth
            let y = (tempV.y * -.5 + .5) * thi.canvas.clientHeight
            let dist = thi.camera.position.distanceTo(box.position)

            // move the elem to that position
            div.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`
            div.style["font-size"] = `${200/dist}px`
        })


        requestAnimationFrame(thi.run)
    }
}


class GeometryStorage {
    constructor() {

    }
}


function main() {
    // document.body.insertAdjacentHTML("beforeend", '<div id="two">two</div>')

    let dimensions = {x:18, y:8, z:17}
    let renderer = new CanvasRenderer(0.5, dimensions)

    let sides = makeSides(dimensions)
    for (let side of Object.values(sides)) {
        for (let line of side) {
            renderer.add_line(line, true)
        }
    }
}

main()