///<reference path="../../typings/index.d.ts"/>
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
    private planeGeometry: THREE.PlaneGeometry;
    private planeMaterial: THREE.Material;
    private plane: THREE.Mesh;
    private flameCnt: number = 0;
    private addFlag: boolean = true;

    constructor() {
        this.createRenderer();
        this.createScene();
    }

    private createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    }

    private createScene() {
        //シーンの作成
        this.scene = new THREE.Scene();

        //カメラの作成
        this.camera = new THREE.PerspectiveCamera(45, this.screenWidth / this.screenHeight, 0.1, 1000);
        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 30;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        //ライトの作成
        this.light = new THREE.SpotLight(0xffffff);
        this.light.position.set(-20, 30, -5);
        this.light.castShadow = true;

        // Cubeの作成
        this.geometry = new THREE.BoxGeometry(3, 3, 3);
        this.material = new THREE.MeshLambertMaterial({color: 0x55ff00});
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.position.y = 3;
        this.cube.castShadow = true;

        // 平面の作成
        this.planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        this.planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = -Math.PI / 2;
        this.plane.position.y = 0;
        this.plane.receiveShadow = true; //影の追加

        this.scene.add(this.camera);
        this.scene.add(this.light);
        this.scene.add(this.plane);
        this.scene.add(this.cube);

        this.addRandomObject();
    }

    public render() {
        this.cube.rotation.x += 0.02;
        this.cube.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
        this.flameCnt++;
        if (this.flameCnt > 10) {
            if (this.addFlag)
                this.addRandomObject();
            else
                this.removeCube();
            this.flameCnt = 0;
        }
        if (this.scene.children.length > 40 || this.scene.children.length < 5)
            this.addFlag = !this.addFlag;

        requestAnimationFrame(this.render.bind(this));
    }

    public addBox() {
        // サイズを決める
        var size: number = Math.ceil(Math.random() * 3);
        // GeometryとMaterialを作成する。
        var geometry: THREE.Geometry = new THREE.BoxGeometry(size, size, size);

        this.addObject(geometry);
    }

    public addCylinder() {
        // サイズを決める
        var size: number = Math.ceil(Math.random() * 3);
        // GeometryとMaterialを作成する。
        var geometry: THREE.Geometry = new THREE.CylinderGeometry(size, size, size);

        this.addObject(geometry);
    }

    public addSphere() {
        // サイズを決める
        var size: number = Math.ceil(Math.random() * 3);
        // GeometryとMaterialを作成する。
        var geometry: THREE.Geometry = new THREE.SphereGeometry(size, size, size);

        this.addObject(geometry);
    }

    private addObject(geometry) {

        var material: THREE.Material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});

        // オブジェクトを生成する
        var obj: THREE.Mesh = new THREE.Mesh(geometry, material);

        // Cubeオブジェクトのプロパティを設定する
        obj.castShadow = true;
        obj.name = "obj-" + this.scene.children.length;

        // Cubeオブジェクトを移動する
        obj.position.x = -30 + Math.round((Math.random() * this.planeGeometry.parameters.width));
        obj.position.y = Math.round((Math.random() * 5));
        obj.position.z = -20 + Math.round((Math.random() * this.planeGeometry.parameters.height));

        //シーンに追加する
        this.scene.add(obj);
    }

    public removeCube() {
        // 子オブジェクトのリストを取得
        var allChildren: THREE.Object3D[] = this.scene.children;

        // 子オブジェクトの最後のオブジェクトのみを取得
        var lastObject: THREE.Object3D = allChildren[allChildren.length - 1];

        // 子オブジェクトをシーンから削除する
        if (lastObject instanceof THREE.Mesh) {
            this.scene.remove(lastObject);
        }

        this.scene.remove(lastObject);

    }

    public addPlane() {
        //Geometryの生成
        var addObjectGeometry: THREE.Geometry = new THREE.PlaneGeometry(10, 10, 1, 1);

        //Materialの生成
        var meshMaterial: THREE.Material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
        var wireMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({wireframe: true});

        //オブジェクトの生成
        var addObject: THREE.Object3D = THREE.SceneUtils.createMultiMaterialObject(addObjectGeometry, [meshMaterial, wireMaterial]);

        //オブジェクトのシーンへの追加
        this.scene.add(addObject);
    }

    public addRandomObject() {
        //０～２の乱数を発生させる。
        var rand = Math.floor(Math.random() * 3);

        switch (rand) {
            case 0:
                this.addBox();
                break;
            case 1:
                this.addCylinder()
                break;
            case 2:
                this.addSphere()
                break;
        }
    }
}

window.onload = () => {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
};