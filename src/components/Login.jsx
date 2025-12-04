// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import { Eye, EyeOff } from "lucide-react"; // Import ikon mata
import styled from "styled-components";

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const LeftPanel = styled.div`
  width: 50%;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("bg-left.jpg") no-repeat center center;
  background-size: cover;
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`;

const Logo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const LogoImg = styled.img`
  width: 120px;
`;

const LeftPanelH1 = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 20px 0;
  line-height: 1.2;
`;

const LeftPanelP = styled.p`
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.6;
`;

const RightPanel = styled.div`
  width: 50%;
  background: url("bg-right.png") no-repeat center center;
  background-size: cover;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RightPanelH2 = styled.h2`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 10px;
`;

const RightPanelP = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  width: 100%;
  max-width: 350px;
  margin-bottom: 20px;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #2c3e50;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: -45px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 24px;
  border-radius: 2px;

  &:hover {
    color: #3498db;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 15px;
  text-align: center;
`;

const SignInBtn = styled.button`
  width: 100%;
  max-width: 350px;
  padding: 12px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1a252f;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.login(email, password);
      const { data: loginData } = response.data;
      const { access_token, user } = loginData;
      const { role: userRole } = user;
      const roleName = userRole.name;
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', roleName);
      navigate("/Dashboard");
    } catch (err) {
      setError('Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LeftPanel>
        <Logo>
          <LogoImg src="/logo login.png" alt="SIPRIMA Logo" />
        </Logo>
        <LeftPanelH1>ASSET AND RISK APPLICATION</LeftPanelH1>
        <LeftPanelP>
          SIPRIMA optimizes efficiency, transparency, and data-driven
          decision-making in government asset and risk management.
        </LeftPanelP>
      </LeftPanel>

      <RightPanel>
        <RightPanelH2>Welcome to SIPRIMA</RightPanelH2>
        <RightPanelP>Login</RightPanelP>

        <form onSubmit={handleLogin}>
          <FormGroup>
            <FormLabel>E-mail Address</FormLabel>
            <FormInput
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Password</FormLabel>
            <PasswordInputContainer>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </PasswordInputContainer>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SignInBtn type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </SignInBtn>
        </form>
      </RightPanel>
    </LoginContainer>
  );
};

export default Login;
