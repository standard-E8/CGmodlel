///<reference path="../../typings/index.d.ts"/>
var ThreeJSTest = (function () {
    function ThreeJSTest() {
        this.screenWidth = 640;
        this.screenHeight = 480;
        this.flameCnt = 0;
        this.addFlag = true;
        this.createRenderer();
        this.createScene();
    }
    ThreeJSTest.prototype.createRenderer = function () {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    };
    ThreeJSTest.prototype.createScene = function () {
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
        this.material = new THREE.MeshLambertMaterial({ color: 0x55ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.position.y = 3;
        this.cube.castShadow = true;
        // 平面の作成
        this.planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        this.planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = -Math.PI / 2;
        this.plane.position.y = 0;
        this.plane.receiveShadow = true; //影の追加
        this.scene.add(this.camera);
        this.scene.add(this.light);
        this.scene.add(this.plane);
        this.scene.add(this.cube);
        this.addRandomObject();
    };
    ThreeJSTest.prototype.render = function () {
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
    };
    ThreeJSTest.prototype.addBox = function () {
        // サイズを決める
        var size = Math.ceil(Math.random() * 3);
        // GeometryとMaterialを作成する。
        var geometry = new THREE.BoxGeometry(size, size, size);
        this.addObject(geometry);
    };
    ThreeJSTest.prototype.addCylinder = function () {
        // サイズを決める
        var size = Math.ceil(Math.random() * 3);
        // GeometryとMaterialを作成する。
        var geometry = new THREE.CylinderGeometry(size, size, size);
        this.addObject(geometry);
    };
    ThreeJSTest.prototype.addSphere = function () {
        // サイズを決める
        var size = Math.ceil(Math.random() * 3);
        // GeometryとMaterialを作成する。
        var geometry = new THREE.SphereGeometry(size, size, size);
        this.addObject(geometry);
    };
    ThreeJSTest.prototype.addObject = function (geometry) {
        var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        // オブジェクトを生成する
        var obj = new THREE.Mesh(geometry, material);
        // Cubeオブジェクトのプロパティを設定する
        obj.castShadow = true;
        obj.name = "obj-" + this.scene.children.length;
        // Cubeオブジェクトを移動する
        obj.position.x = -30 + Math.round((Math.random() * this.planeGeometry.parameters.width));
        obj.position.y = Math.round((Math.random() * 5));
        obj.position.z = -20 + Math.round((Math.random() * this.planeGeometry.parameters.height));
        //シーンに追加する
        this.scene.add(obj);
    };
    ThreeJSTest.prototype.removeCube = function () {
        // 子オブジェクトのリストを取得
        var allChildren = this.scene.children;
        // 子オブジェクトの最後のオブジェクトのみを取得
        var lastObject = allChildren[allChildren.length - 1];
        // 子オブジェクトをシーンから削除する
        if (lastObject instanceof THREE.Mesh) {
            this.scene.remove(lastObject);
        }
        this.scene.remove(lastObject);
    };
    ThreeJSTest.prototype.addPlane = function () {
        //Geometryの生成
        var addObjectGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
        //Materialの生成
        var meshMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        var wireMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
        //オブジェクトの生成
        var addObject = THREE.SceneUtils.createMultiMaterialObject(addObjectGeometry, [meshMaterial, wireMaterial]);
        //オブジェクトのシーンへの追加
        this.scene.add(addObject);
    };
    ThreeJSTest.prototype.addRandomObject = function () {
        //０～２の乱数を発生させる。
        var rand = Math.floor(Math.random() * 3);
        switch (rand) {
            case 0:
                this.addBox();
                break;
            case 1:
                this.addCylinder();
                break;
            case 2:
                this.addSphere();
                break;
        }
    };
    return ThreeJSTest;
}());
window.onload = function () {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
};
