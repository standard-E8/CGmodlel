///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules\@types\three\index.d.ts"/>
class ThreeJSTest {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.Geometry;
    private material: THREE.Material;
    private cube: THREE.Mesh;
    private light: THREE.Light;
    private screenWidth: number = 640;
    private screenHeight: number = 480;
    private d2Shape: THREE.Geometry;
    private shapeMesh: THREE.Object3D;
    private controls: GuiControl;

    constructor() {
        this.createRenderer();
        this.createScene();
    }
    private createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        document.body.appendChild(this.renderer.domElement);
    }
    private createScene() {
        this.scene = new THREE.Scene();
        this.geometry = new THREE.BoxGeometry(20, 20, 20);
        this.material = new THREE.MeshLambertMaterial({ color: 0x55ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.cube);
        this.camera = new THREE.PerspectiveCamera(75, this.screenWidth /　this.screenHeight, 0.1, 1000);
        this.camera.position.x = 50;
        this.camera.position.y = 50;
        this.camera.position.z = 50;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(-25, 25, 50);
        this.scene.add(this.light);
        var options = {
            amount: 10,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 12,
            steps: 1
        };
        var shapeGeometry = new THREE.ExtrudeGeometry(this.drawShape(), options)
        var material1 = new THREE.MeshBasicMaterial();
        var material2 = new THREE.MeshNormalMaterial();
        material1.wireframe = true;
        this.shapeMesh = THREE.SceneUtils.createMultiMaterialObject(shapeGeometry,[material1, material2]);
        this.scene.add(this.shapeMesh);
        // dat.gui
        this.controls = new GuiControl();
        var gui = new dat.GUI();
        gui.add(this.controls, 'rotationSpeed', 0, 0.5);
    }
    public render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
    public drawShape() {
        //&nbsp;THREE.Shapeを作成
        var shape = new THREE.Shape();
        // スタート地点へ移動
        shape.moveTo(10,10);
        // 線を描く
        shape.lineTo(10,40);
        //2次のカーブを描く
        shape.quadraticCurveTo(10,50,30,40);
        //Spline曲線を描く
        shape.splineThru([new THREE.Vector2(32, 30), new THREE.Vector2(20, 20), new THREE.Vector2(25, 10)]);
        return shape;
    }
}
class GuiControl {
    public rotationSpeed: number;
    constructor() {
        this.rotationSpeed = 0.01;
    }
}
window.onload = () => {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
};