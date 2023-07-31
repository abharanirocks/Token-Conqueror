import React from 'react';
import { useState ,useRef,useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import * as THREE from "three";

import './AuthForm.css'

function App() {
		const history = useHistory()
		 const containerRef = useRef(null);
     const sceneRef = useRef(null);
     const cameraRef = useRef(null);
     const rendererRef = useRef(null);
     const raycasterRef = useRef(null);
     const sphereInterRef = useRef(null);

	const [email, setEmail] = useState("abc@g.com");
	const [password, setPassword] = useState("abc@g.com");
  const [address, setAddress] = useState("");


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

	async function loginUser(event) {
		event.preventDefault()
try{
		const response = await fetch('http://localhost:3000/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
        address
			}),
		})

		const data = await response.json()

		if (response.ok) {
			localStorage.setItem('token', data.token)
      localStorage.setItem('isAdmin', data.isAdmin)

      console.log(localStorage.getItem("token"));
			alert('Login successful')
      if (localStorage.getItem("isAdmin") === "true") {
        			history.replace("/admin");
      }else{
        history.replace('/game')
      }
		} else {
			alert('Please check your username, password and wallet address')
		}
	}catch(err){
		console.error("Error",err);
	}
	}

	return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div className="auth-container">
          {/* <ThreeJSInstancingExample/> */}
          <h1>Login</h1>
          <form onSubmit={loginUser} className="auth-form">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <br />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="address"
              placeholder="Address"
            />
            <br />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <br />
            <input type="submit" value="Login" className="toggle-link" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App