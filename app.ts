///<reference path="./node_modules/@types/three/index.d.ts"/>
///<reference path="./node_modules/@types/dat-gui/index.d.ts"/>
class ThreeJSTest {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.Geometry;
    private material: THREE.Material;
    private cube: THREE.Mesh;
    private light: THREE.Light;
    public cloud:THREE.Points;

    //コントロール系
    private controls: GuiControl;
    private orbitControl: THREE.OrbitControls;
    private viewport: HTMLElement;　//新規追加

    constructor() {
        this.createRenderer();
        this.createScene();
    }

    private createRenderer() {
        //追加の設定
        this.viewport = document.getElementById("viewport");

        // dat.GUI
        var gui = new dat.GUI({ autoPlace: false, width: 512 });
        var guielement = document.createElement("div");
        guielement.id = "dat-gui";
        guielement.appendChild(gui.domElement);
        this.viewport.appendChild(guielement);

        // コントロールの追加
        this.controls = new GuiControl();
        gui.add(this.controls, 'rotationSpeed', 0, 0.5);
        gui.add(this.controls, 'particleNum', 0, 65535).onChange((e:number) => {
            this.createParticles(e);
        })
        gui.add(this.controls, 'transparent').onChange((e:boolean) => {
            this.cloud.material.transparent = e;
        })
        gui.add(this.controls, 'opacity', 0, 1.0).onChange((e:number) => {
            this.cloud.material.opacity = e;
        })

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        this.viewport.appendChild(this.renderer.domElement);
    }
    private createScene() {
        this.scene = new THREE.Scene();

        //Cubeの設定
        this.geometry = new THREE.BoxGeometry(30, 30, 30);
        this.material = new THREE.MeshLambertMaterial({ color: 0x55ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.cube);

        //カメラの設定
        this.camera = new THREE.PerspectiveCamera(75, this.viewport.clientWidth / this.viewport.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(100, 100, 100);
        this.scene.add(this.light);

        // OrbitControl
        this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // partcle
        this.createParticles(10000);
    }

    public render() {
        this.cube.rotation.x += this.controls.rotationSpeed;
        this.cloud.rotation.x += this.controls.rotationSpeed;
        this.orbitControl.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));

    }
    public createParticles(num:Number) {
        this.scene.remove( this.scene.children[this.scene.children.length - 1])
        //ジオメトリの作成
        var geom = new THREE.Geometry();
        //マテリアルの作成
        var material = new THREE.PointsMaterial({ size: 4, vertexColors: THREE.VertexColors })
        //particleの作成
            for (var i = 0; i < num;  i++) {
                var particle = new THREE.Vector3(Math.random() * 200 - 200/2 , Math.random() * 150 - 150/2 , 0);
                geom.vertices.push(particle);
                geom.colors.push(new THREE.Color(Math.random() * 0x00ffff));//色を設定
            }
        //THREE.Pointsの作成
        this.cloud = new THREE.Points(geom, material);
        //シーンへの追加
        this.scene.add(this.cloud)
    }
}

window.onload = () => {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
};

class GuiControl {
    public rotationSpeed: number;
    public particleNum: number;
    public transparent: boolean;
    public opacity: number;
    constructor() {
        this.rotationSpeed = 0.01;
        this.particleNum = 10000;
        this.transparent = false;
        this.opacity = 0.5;
    }
}
