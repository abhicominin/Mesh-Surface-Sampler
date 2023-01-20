import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler"
import { TextureLoader } from "three"
import * as YUKA from "yuka"
import { Think } from "yuka"
import * as dat from "dat.gui"
import { Mesh } from "three"

//group
const group = new THREE.Group()

//scene
const scene = new THREE.Scene()

//gui
const gui = new dat.GUI()

//lights
const pointlight = new THREE.PointLight(0xffffff, 1)
pointlight.position.set(0, 30, 0)
scene.add(pointlight)


// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(180,60,160)
scene.add(camera)


//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor(0xffffff)
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



let elephant 
let sampler 
let paths = []
const objloader = new OBJLoader()
objloader.load('Mesh_Elephant.obj', function ( obj ){
    elephant = obj.children[0]
    sampler = new MeshSurfaceSampler(elephant).build()

    for( let i = 0; i < 4 ; i++ ){
        const path = new Path(i)
        paths.push(path)
        group.add(path.line)
    }

    renderer.setAnimationLoop(tick)
})

const tempposition = new THREE.Vector3()

const materials = [new THREE.LineBasicMaterial({color: 0xFAAD80, transparent: true, opacity: 0.5}),
    new THREE.LineBasicMaterial({color: 0xFF6767, transparent: true, opacity: 0.5}),
    new THREE.LineBasicMaterial({color: 0xFF3D68, transparent: true, opacity: 0.5}),
    new THREE.LineBasicMaterial({color: 0xA73489, transparent: true, opacity: 0.5})]

class Path {
    constructor(index) {
        
        this.geometry = new THREE.BufferGeometry()

        this.material = materials[index % 4]

        this.vertices = []

        this.line = new THREE.Line( this.geometry , this.material)

        sampler.sample(tempposition)

        this.previouspoint = tempposition.clone()
    }

    update() {

        let pointfound = false

        while( !pointfound )
        {
            sampler.sample( tempposition )

            if( tempposition.distanceTo( this.previouspoint ) < 20)
            {
                this.vertices.push( tempposition.x , tempposition.y , tempposition.z)

                this.previouspoint = tempposition.clone()

                pointfound = true
            }
        }

        this.geometry.setAttribute( "position" , new THREE.Float32BufferAttribute( this.vertices , 3))
    }


}


scene.add(group)

//clock
const clock = new THREE.Clock()


//controls
const controls = new OrbitControls(camera, renderer.domElement)


//animation loop
function tick() {
  const elapsedtime = clock.getElapsedTime()
  group.rotation.y += 0.001

  paths.forEach( path => {
  if( path.vertices.length < 10000)
  {
     path.update()
  }
})
  //requestAnimationFrame(tick)
  renderer.render(scene, camera)
}
//tick()



// resize event
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight,
  camera.updateProjectionMatrix()
})
