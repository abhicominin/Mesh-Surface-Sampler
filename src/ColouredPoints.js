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

const vertices = []
const colors = []

const sparklegeometry = new THREE.BufferGeometry()

const sparklematerial = new THREE.PointsMaterial({
    size : 1.5,
    alphaTest : 0.2,
    map : new THREE.TextureLoader().load("./dottexture.png"),
    vertexColors : true
})

const points = new THREE.Points(sparklegeometry , sparklematerial)
group.add(points)


let elephant 
let sampler 
const objloader = new OBJLoader()
objloader.load('Mesh_Elephant.obj', function ( obj ){
    elephant = obj.children[0]
    
    elephant.material = new THREE.MeshBasicMaterial({
        wireframe : true,
        color : 0x000000,
        transparent : true,
        opacity : 0.05
    })

    group.add(obj)

    sampler = new MeshSurfaceSampler(elephant).build()


    renderer.setAnimationLoop(tick)
})


const palette = [new THREE.Color("#FAAD80"), new THREE.Color("#FF6767"), new THREE.Color("#FF3D68"), new THREE.Color("#A73489")]

const tempposition = new THREE.Vector3()

function addPoint(){

    sampler.sample(tempposition)

    vertices.push( tempposition.x , tempposition.y , tempposition.z)

    sparklegeometry.setAttribute('position' , new THREE.Float32BufferAttribute( vertices , 3))

    const color = palette[Math.floor(Math.random() * palette.length)]

    colors.push( color.r , color.g , color.b )

    sparklegeometry.setAttribute('color' , new THREE.Float32BufferAttribute( colors , 3))
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
  if( vertices.length < 30000)
  {
    addPoint()
  }
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
