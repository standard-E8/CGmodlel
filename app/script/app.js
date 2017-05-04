///<reference path="../../typings/index.d.ts"/>
var ThreeJSTest = (function () {
    function ThreeJSTest() {
        this.screenWidth = 640;
        this.screenHeight = 480;
        this.createRenderer();
        this.createScene();
    }
    ThreeJSTest.prototype.createRenderer = function () {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        this.renderer.shadowMap.enabled = true; //影の追加
        document.body.appendChild(this.renderer.domElement);
    };
    ThreeJSTest.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: 0x55ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.castShadow = true; //影の追加
        this.scene.add(this.cube);
        this.camera = new THREE.PerspectiveCamera(75, this.screenWidth / this.screenHeight, 0.1, 1000);
        this.camera.position.x = 3;
        this.camera.position.y = 3;
        this.camera.position.z = 3;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position = new THREE.Vector3(1, 1, 1).normalize();
        this.light.castShadow = true; // この行を追加
        this.scene.add(this.light);
        // 平面
        this.planeGeometry = new THREE.PlaneGeometry(5, 5);
        this.planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = -Math.PI / 2;
        this.plane.position.y = -1;
        this.plane.receiveShadow = true; //影の追加
        this.scene.add(this.plane);
    };
    ThreeJSTest.prototype.render = function () {
        this.cube.rotation.x += 0.02;
        this.cube.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    };
    return ThreeJSTest;
}());
window.onload = function () {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
};
