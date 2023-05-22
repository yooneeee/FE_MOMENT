import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from "../pages/Start";
import Main from "../pages/Main";
import Login from "../pages/Login";
import Layout from "./Layout";
import Feed from "../pages/Feed";
import Board from "../pages/Board";


const Router = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="main" element={<Main />} />
                    <Route path="login" element={<Login />} />
                    <Route path="feed" element={<Feed />} /> 
                    <Route path="board" element={<Board />} /> 
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

export default Router;