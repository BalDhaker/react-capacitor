import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
function App() {

  const openCamera = async() =>{
    const image = await Camera.getPhoto({
      source: CameraSource.Camera,
      webUseInput: false,
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
  
    console.log("Image", image);
  }
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={openCamera}>
          Open Camera
        </button>
</div>

    </>
  )
}

export default App
