// Limyè ak lonbraj pou jwèt la (Kole sa anndan fichye .js la)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0x1a2238, 0.6); 
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x7996c2, 1.2);
moonLight.position.set(20, 40, 20);
moonLight.castShadow = true;

moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 150;

const d = 40;
moonLight.shadow.camera.left = -d;
moonLight.shadow.camera.right = d;
moonLight.shadow.camera.top = d;
moonLight.shadow.camera.bottom = -d;
moonLight.shadow.bias = -0.0005;

scene.add(moonLight);

