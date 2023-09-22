import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./SignUp.styles";
import Button from "../../components/@common/Button/Button";
import Input from "../../components/@common/Input/Input";
import { getCookie } from "../../utils/cookie";
import Position from "../../components/@common/Position/Position";
import useFooter from "../../hooks/useFooter";
import useApi from "../../hooks/useApi";
import VALIDATE from "../../constants/regex";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [position, setPosition] = useState("");
  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState(true);
  const navigate = useNavigate();
  useFooter();

  const { trigger } = useApi({});

  function fetchUserData() {
    const email = decodeURIComponent(getCookie("email"));
    // 비유저가 들어왔을 때
    if (email !== "undefined") {
      setEmail(email);
    } else {
      // console.log(email);
      navigate("/");
    }

    // 유저가 들어왔을 때
    const isUser = getCookie("isUser");
    if (isUser) {
      navigate("/");
    }
  }
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleNameChange = (event) => {
    const userName = event.target.value;
    setName(userName);
    if (VALIDATE.name.test(userName)) {
      setName(userName);
      setNameError("");
    } else {
      setNameError("2자에서 10자 사이의 한글로 입력해 주세요.");
    }
  };

  const handleNicknameChange = (event) => {
    const userNickName = event.target.value;
    setNickName(userNickName);
    if (VALIDATE.nickName.test(userNickName)) {
      setNickName(userNickName);
      setNicknameError("");
    } else {
      setNicknameError(
        "한글, 영어, 숫자, 공백 포함 2자에서 10자 사이로 입력해 주세요."
      );
    }
  };

  const handleJobChange = (event) => {
    setPosition(event.target.value);
  };

  const checkNicknameAvailable = () => {
    trigger({
      path: "/validate-nickname",
      method: "get",
      params: { nickname: nickName },
    });
    // try {
    // trigger({
    // path: '/validate-nickname',
    // method: 'get',
    // params: { nickname: nickName },
    // }); // API 경로를 업데이트하세요.
    // if (response.data.available) {
    // setNicknameAvailable(true); // 별명이 사용 가능한 경우
    // } else {
    // setNicknameAvailable(false); // 별명이 이미 사용 중인 경우
    // }
    // } catch (error) {
    // console.error('별명 가용성 확인 중 오류 발생:', error);
    // // 오류를 적절하게 처리합니다.
    // }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !nickName || !position) {
      alert("모든 필수 정보를 입력해 주세요.");
      return;
    }

    try {
      await trigger({
        path: "/auth/signup",
        method: "post",
        data: {
          name,
          email,
          nickName,
          position,
        },
      });
      navigate("/signup/done");
    } catch (err) {
      console.error("Error caught:", err);
      console.log("Error response data:", err.response.data);
      if (
        err.response.data.result === "MongoServerError" &&
        err.response.data.reason.includes("duplicate key")
      ) {
        alert("이미 사용중인 닉네임입니다.");
      } else {
        alert("회원가입에 실패하였습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <S.Wrap>
      <S.RegisterForm onSubmit={handleSubmit}>
        <p>회원 가입</p>
        <div>
          <label>이메일</label>
          <Input type="text" value={email} readOnly size={"medium"} />
        </div>
        <div>
          <label>이름</label>
          <Input
            type="text"
            value={name}
            placeholder="이름을 입력해 주세요."
            size={"medium"}
            onChange={handleNameChange}
            error={nameError}
          />
          {nameError && <S.StyledError>{nameError}</S.StyledError>}
        </div>
        <div>
          <label>닉네임</label>
          <S.NickNameCheck>
            <Input
              type="text"
              placeholder="닉네임을 입력해 주세요."
              value={nickName}
              onChange={handleNicknameChange}
              size={"small"}
            />
            <Button
              variant={"reverse"}
              shape={"default"}
              size={"small"}
              onClick={checkNicknameAvailable}
            >
              중복 확인
            </Button>
          </S.NickNameCheck>

          {nicknameError && <S.StyledError>{nicknameError}</S.StyledError>}
        </div>
        <div>
          <label>직무</label>
          <Position
            onChange={handleJobChange}
            position={position}
            size={"regular"}
            font={"regular"}
          />
        </div>
        <Button
          variant={"primary"}
          shape={"default"}
          size={"big"}
          type="submit"
        >
          가입 완료하기
        </Button>
      </S.RegisterForm>
    </S.Wrap>
  );
}

export default SignUp;
