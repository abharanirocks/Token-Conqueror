import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import * as THREE from "three";

const ThreeJSInstancingExample = () => {
  const history = useHistory();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const raycasterRef = useRef(null);
  const sphereInterRef = useRef(null);
  const handleLogin = () => {
    history.push("/login");
    console.log("login button clicked");
  };

  const handleRegister = () => {
    history.push("/register");
    console.log("register button clicked");
  };

  useEffect(() => {
    let container, stats;
    let parentTransform;

    const pointer = new THREE.Vector2();
    const radius = 100;
    let theta = 0;

    init();
    animate();

    function init() {
      container = containerRef.current;

      cameraRef.current = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );

      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0xf0f0f0);

      const geometry = new THREE.SphereGeometry(5);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

      sphereInterRef.current = new THREE.Mesh(geometry, material);
      sphereInterRef.current.visible = false;
      sceneRef.current.add(sphereInterRef.current);

      const lineGeometry = new THREE.BufferGeometry();
      const points = [];

      const point = new THREE.Vector3();
      const direction = new THREE.Vector3();

      for (let i = 0; i < 50; i++) {
        direction.x += Math.random() - 0.5;
        direction.y += Math.random() - 0.5;
        direction.z += Math.random() - 0.5;
        direction.normalize().multiplyScalar(10);

        point.add(direction);
        points.push(point.x, point.y, point.z);
      }

      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3)
      );

      parentTransform = new THREE.Object3D();
      parentTransform.position.x = Math.random() * 40 - 20;
      parentTransform.position.y = Math.random() * 40 - 20;
      parentTransform.position.z = Math.random() * 40 - 20;

      parentTransform.rotation.x = Math.random() * 2 * Math.PI;
      parentTransform.rotation.y = Math.random() * 2 * Math.PI;
      parentTransform.rotation.z = Math.random() * 2 * Math.PI;

      parentTransform.scale.x = Math.random() + 0.5;
      parentTransform.scale.y = Math.random() + 0.5;
      parentTransform.scale.z = Math.random() + 0.5;

      for (let i = 0; i < 50; i++) {
        let object;

        const lineMaterial = new THREE.LineBasicMaterial({
          color: Math.random() * 0xffffff,
        });

        if (Math.random() > 0.5) {
          object = new THREE.Line(lineGeometry, lineMaterial);
        } else {
          object = new THREE.LineSegments(lineGeometry, lineMaterial);
        }

        object.position.x = Math.random() * 400 - 200;
        object.position.y = Math.random() * 400 - 200;
        object.position.z = Math.random() * 400 - 200;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;

        parentTransform.add(object);
      }

      sceneRef.current.add(parentTransform);

      raycasterRef.current = new THREE.Raycaster();
      raycasterRef.current.params.Line.threshold = 3;

      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(rendererRef.current.domElement);

      document.addEventListener("pointermove", onPointerMove);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function animate() {
      requestAnimationFrame(animate);

      render();
    }

    function render() {
      theta += 0.1;

      cameraRef.current.position.x =
        radius * Math.sin(THREE.MathUtils.degToRad(theta));
      cameraRef.current.position.y =
        radius * Math.sin(THREE.MathUtils.degToRad(theta));
      cameraRef.current.position.z =
        radius * Math.cos(THREE.MathUtils.degToRad(theta));
      cameraRef.current.lookAt(sceneRef.current.position);

      cameraRef.current.updateMatrixWorld();

      raycasterRef.current.setFromCamera(pointer, cameraRef.current);

      const intersects = raycasterRef.current.intersectObjects(
        parentTransform.children,
        true
      );

      if (intersects.length > 0) {
        sphereInterRef.current.visible = true;
        sphereInterRef.current.position.copy(intersects[0].point);
      } else {
        sphereInterRef.current.visible = false;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <button
          id="loginButton"
          onClick={handleLogin}
          style={{
            fontSize: "1.5rem",
            padding: "1rem 2rem",
            backgroundColor: "transparent",
            border: "1px solid",
            width: "200px",
            color: "black",
          }}
        >
          Login
        </button>
        <button
          id="registerButton"
          onClick={handleRegister}
          style={{
            fontSize: "1.5rem",
            padding: "1rem 2rem",
            backgroundColor: "transparent",
            border: "1px solid",
            width: "200px",
            color: "black",
            marginTop: "1rem",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default ThreeJSInstancingExample;

// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

// const ThreeJSInstancingExample = () => {
//   const containerRef = useRef(null);
//   const handleLogin = () => {
//     console.log("login button clicked");
//   };

//   const handleRegister = () => {
//     console.log("register button clicked");
//   };

//   useEffect(() => {
//     let container, stats;
//     let camera, scene, raycaster, renderer, parentTransform, sphereInter;

//     const pointer = new THREE.Vector2();
//     const radius = 100;
//     let theta = 0;

//     init();
//     animate();

//     function init() {
//       container = containerRef.current;

//       const loginButton = document.getElementById("loginButton");
//       loginButton.addEventListener("click", handleLogin);

//       const registerButton = document.getElementById("registerButton");
//       registerButton.addEventListener("click", handleRegister);

//       camera = new THREE.PerspectiveCamera(
//         70,
//         window.innerWidth / window.innerHeight,
//         1,
//         10000
//       );

//       scene = new THREE.Scene();
//       scene.background = new THREE.Color(0xf0f0f0);

//       const geometry = new THREE.SphereGeometry(5);
//       const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

//       sphereInter = new THREE.Mesh(geometry, material);
//       sphereInter.visible = false;
//       scene.add(sphereInter);

//       const lineGeometry = new THREE.BufferGeometry();
//       const points = [];

//       const point = new THREE.Vector3();
//       const direction = new THREE.Vector3();

//       for (let i = 0; i < 50; i++) {
//         direction.x += Math.random() - 0.5;
//         direction.y += Math.random() - 0.5;
//         direction.z += Math.random() - 0.5;
//         direction.normalize().multiplyScalar(10);

//         point.add(direction);
//         points.push(point.x, point.y, point.z);
//       }

//       lineGeometry.setAttribute(
//         "position",
//         new THREE.Float32BufferAttribute(points, 3)
//       );

//       parentTransform = new THREE.Object3D();
//       parentTransform.position.x = Math.random() * 40 - 20;
//       parentTransform.position.y = Math.random() * 40 - 20;
//       parentTransform.position.z = Math.random() * 40 - 20;

//       parentTransform.rotation.x = Math.random() * 2 * Math.PI;
//       parentTransform.rotation.y = Math.random() * 2 * Math.PI;
//       parentTransform.rotation.z = Math.random() * 2 * Math.PI;

//       parentTransform.scale.x = Math.random() + 0.5;
//       parentTransform.scale.y = Math.random() + 0.5;
//       parentTransform.scale.z = Math.random() + 0.5;

//       for (let i = 0; i < 50; i++) {
//         let object;

//         const lineMaterial = new THREE.LineBasicMaterial({
//           color: Math.random() * 0xffffff,
//         });

//         if (Math.random() > 0.5) {
//           object = new THREE.Line(lineGeometry, lineMaterial);
//         } else {
//           object = new THREE.LineSegments(lineGeometry, lineMaterial);
//         }

//         object.position.x = Math.random() * 400 - 200;
//         object.position.y = Math.random() * 400 - 200;
//         object.position.z = Math.random() * 400 - 200;

//         object.rotation.x = Math.random() * 2 * Math.PI;
//         object.rotation.y = Math.random() * 2 * Math.PI;
//         object.rotation.z = Math.random() * 2 * Math.PI;

//         object.scale.x = Math.random() + 0.5;
//         object.scale.y = Math.random() + 0.5;
//         object.scale.z = Math.random() + 0.5;

//         parentTransform.add(object);
//       }

//       scene.add(parentTransform);

//       raycaster = new THREE.Raycaster();
//       raycaster.params.Line.threshold = 3;

//       renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setPixelRatio(window.devicePixelRatio);
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       container.appendChild(renderer.domElement);

//       document.addEventListener("pointermove", onPointerMove);

//       window.addEventListener("resize", onWindowResize);
//     }

//     function onWindowResize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();

//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function onPointerMove(event) {
//       pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//       pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     }

//     function animate() {
//       requestAnimationFrame(animate);

//       render();
//     }

//     function render() {
//       theta += 0.1;

//       camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
//       camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
//       camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
//       camera.lookAt(scene.position);

//       camera.updateMatrixWorld();

//       raycaster.setFromCamera(pointer, camera);

//       const intersects = raycaster.intersectObjects(
//         parentTransform.children,
//         true
//       );

//       if (intersects.length > 0) {
//         sphereInter.visible = true;
//         sphereInter.position.copy(intersects[0].point);
//       } else {
//         sphereInter.visible = false;
//       }

//       renderer.render(scene, camera);
//     }
//   }, []);

//   return (
//     <div>
//       <div
//         ref={containerRef}
//         style={{
//           position: "relative",
//           width: "100%",
//           height: "100vh",
//           backgroundColor: "#f0f0f0",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             alignItems: "flex-end",
//             flexDirection: "column",
//           }}
//         >
//           <button
//             id="loginButton"
//             onClick={handleLogin}
//             style={{
//               fontSize: "1.5rem",
//               padding: "1rem 2rem",
//               backgroundColor: "transparent",
//               border: "1px solid",
//               width: "200px",
//               color: "black",
//             }}
//           >
//             Login
//           </button>
//           <button
//             id="registerButton"
//             onClick={handleRegister}
//             style={{
//               fontSize: "1.5rem",
//               padding: "1rem 2rem",
//               backgroundColor: "transparent",
//               border: "1px solid",
//               width: "200px",
//               color: "black",
//             }}
//           >
//             Register
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThreeJSInstancingExample;
