import * as THREE from "../../node_modules/three/build/three.module.js";

export class BuildingGenerator {
  constructor(scene, collision = null) {
    this.scene = scene;
    this.collision = collision;
    this.materials = this.#initMaterials();
  }

  #initMaterials() {
    return {
      // Koulè bilding yo (brik fonse ak siman New York style)
      concrete:     new THREE.MeshStandardMaterial({ color: 0x3a3d40, roughness: 0.9, metalness: 0.1 }),
      darkConcrete: new THREE.MeshStandardMaterial({ color: 0x242729, roughness: 0.95 }),
      
      // Vit cho (efè limyè limen anndan batiman an tankou nan foto a)
      glass:        new THREE.MeshStandardMaterial({ 
        color: 0xffd1a9, 
        emissive: 0x7c4f30, // Fè vit la briye dousman
        roughness: 0.1, 
        metalness: 0.2 
      }),
      
      frame:        new THREE.MeshStandardMaterial({ color: 0x1c1e20, roughness: 0.7 }),
      
      // Lanèj sou to a ak sou balkon yo
      snow:         new THREE.MeshStandardMaterial({ color: 0xeef2f7, roughness: 0.9 }),
      
      // Twotwa ak asfalt lari a
      sidewalk:     new THREE.MeshStandardMaterial({ color: 0x5a5e63, roughness: 0.95 }),
      metal:        new THREE.MeshStandardMaterial({ color: 0x2b2e31, metalness: 0.5, roughness: 0.5 })
    };
  }

  createBuilding({ id = "Building", x = 0, z = 0, width = 18, depth = 18, height = 30, floors = 6, style = 0 } = {}) {
    const buildingGroup = new THREE.Group();
    buildingGroup.name = id;
    buildingGroup.position.set(x, 0, z);

    this.#buildMainShell(buildingGroup, width, height, depth, style);
    this.#addFacadePanels(buildingGroup, width, depth, height);
    this.#addWindows(buildingGroup, width, depth, height, floors, style);
    this.#addBalconies(buildingGroup, width, depth, height, floors, style);
    this.#addEntrance(buildingGroup, width, depth);
    this.#addRoof(buildingGroup, width, depth, height);
    this.#addSidewalk(buildingGroup, width, depth);

    this.scene.add(buildingGroup);
    this.#registerCollision(id, buildingGroup, width, height, depth);

    return buildingGroup;
  }

  #buildMainShell(group, width, height, depth, style) {
    const material = style % 2 === 0 ? this.materials.concrete : this.materials.darkConcrete;
    const shell = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    shell.position.y = height / 2;
    shell.castShadow = true;
    shell.receiveShadow = true;
    group.add(shell);
  }

  #addWindows(group, width, depth, height, floors, style) {
    const floorHeight = height / floors;
    const winWidth = Math.min(1.5, width / 9);
    const winHeight = Math.min(2.3, floorHeight * 0.65);
    const gapX = 3.0;
    const columns = Math.max(2, Math.floor(width / gapX));

    for (let floor = 0; floor < floors; floor++) {
      const yPos = floor * floorHeight + (floorHeight * 0.5);
      
      for (let col = 0; col < columns; col++) {
        const xPos = -width / 2 + 2.0 + (col * gapX);
        if (Math.abs(xPos) > (width / 2 - 1.2)) continue;

        // Nou mete kèk vit limen, kèk fè nwa pou plis reyalis
        const isWindowLit = (floor + col + style) % 3 !== 0;
        const currentGlassMat = isWindowLit ? this.materials.glass : new THREE.MeshStandardMaterial({ color: 0x121518, roughness: 0.5 });

        this.#buildSingleWindow(group, xPos, yPos, (depth / 2 + 0.02), winWidth, winHeight, currentGlassMat, 0);
        this.#buildSingleWindow(group, xPos, yPos, (-depth / 2 - 0.02), winWidth, winHeight, currentGlassMat, Math.PI);
      }
    }
  }

  #buildSingleWindow(group, x, y, z, w, h, material, rotationY) {
    const winMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), material);
    winMesh.position.set(x, y, z);
    winMesh.rotation.y = rotationY;
    group.add(winMesh);

    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.04), this.materials.frame);
    frameMesh.position.set(x, y, z);
    frameMesh.rotation.y = rotationY;
    group.add(frameMesh);

    // Ti kouch lanèj sou rebò fenèt la
    const snowLedge = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.05, 0.1), this.materials.snow);
    const zOffset = rotationY === 0 ? 0.05 : -0.05;
    snowLedge.position.set(x, y - h/2, z + zOffset);
    group.add(snowLedge);
  }

  #addFacadePanels(group, width, depth, height) {
    const panelWidth = 0.2;
    const count = Math.max(3, Math.floor(width / 4));
    for (let i = 0; i <= count; i++) {
      const xPos = -width / 2 + (i / count) * width;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, height, 0.1), this.materials.frame);
      panel.position.set(xPos, height / 2, depth / 2 + 0.04);
      group.add(panel);
    }
  }

  #addBalconies(group, width, depth, height, floors, style) {
    if (style % 2 === 0) return;
    const floorHeight = height / floors;
    const balconyCount = Math.max(1, Math.floor(floors / 3));
    const balconyWidth = Math.min(width * 0.8, 12);

    for (let i = 1; i <= balconyCount; i++) {
      const yPos = i * floorHeight * 1.5;
      if (yPos >= height) continue;

      const balcony = new THREE.Mesh(new THREE.BoxGeometry(balconyWidth, 0.2, 2.0), this.materials.concrete);
      balcony.position.set(0, yPos, depth / 2 + 1.0);
      group.add(balcony);

      // Kouch lanèj sou balkon an
      const snowOnBalcony = new THREE.Mesh(new THREE.BoxGeometry(balconyWidth, 0.05, 2.0), this.materials.snow);
      snowOnBalcony.position.set(0, yPos + 0.1, depth / 2 + 1.0);
      group.add(snowOnBalcony);
    }
  }

  #addEntrance(group, width, depth) {
    const entrance = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.5, 0.2), this.materials.frame);
    entrance.position.set(0, 2.25, depth / 2 + 0.05);
    group.add(entrance);
  }

  #addRoof(group, width, depth, height) {
    // To a
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.4, depth + 0.2), this.materials.concrete);
    roof.position.y = height + 0.2;
    group.add(roof);

    // Gwo kouch lanèj blan nèt ki kouvri tèt batiman an tankou nan foto a
    const snowRoof = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.2, depth + 0.3), this.materials.snow);
    snowRoof.position.y = height + 0.5;
    group.add(snowRoof);
  }

  #addSidewalk(group, width, depth) {
    // Twotwa kouvri ak lanèj partialman
    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(width + 4, 0.2, depth + 4), this.materials.sidewalk);
    sidewalk.position.y = 0.1;
    sidewalk.receiveShadow = true;
    group.add(sidewalk);
  }

  #registerCollision(id, group, width, height, depth) {
    if (!this.collision) return;
    const box = new THREE.Box3();
    box.min.set(group.position.x - width / 2, 0, group.position.z - depth / 2);
    box.max.set(group.position.x + width / 2, height, group.position.z + depth / 2);
    this.collision.register(id, { min: box.min.clone(), max: box.max.clone() });
  }
}


