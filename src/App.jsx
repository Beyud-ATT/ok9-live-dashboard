import { Route, Routes } from "react-router";
import MainLayout from "./layout/Index";
import Chat from "./pages/chat/Index";
import Home from "./pages/home/Index";
import LiveStream from "./pages/live-stream/Index";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import GameConfig from "./pages/game-config/Index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="live-stream" element={<LiveStream />} />
          <Route path="game-config" element={<GameConfig />} />
        </Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
