/* eslint-disable prefer-regex-literals */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import tw from 'twin.macro';
import Swal from 'sweetalert2';
import useSingUp from '../../../hooks/queries/useSingUp';
import { idCheckStudentApi, emailCheckStudentApi } from '../../../api/userApi';

export default function SignUpStudentForm() {
  const { useSignUpStudent } = useSingUp();
  const [registerdId, setRegisteredId] = useState(true);
  const [registerdEmail, setRegisteredEmail] = useState(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onRegister = data => {
    if (registerdId || registerdEmail) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: '중복확인이 되지 않았습니다..',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      useSignUpStudent.mutate({
        id: data.id,
        password: data.password,
        passwordHelper: data.password_helper,
        name: data.name,
        nameHelper: data.name_helper,
        birth: data.birth,
        phoneHelper: data.phone,
        email: data.email,
      });
      setRegisteredId(true);
      setRegisteredEmail(true);
    }
  };

  const onCheckId = async id => {
    if (id.length < 5) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: '5글자 이상 입력해주세요.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const response = await idCheckStudentApi(id);
    // console.log(response.data);
    if (!response.data) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '중복 아이디입니다.',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '사용가능한 아이디입니다.',
        showConfirmButton: false,
        timer: 1500,
      });
      setRegisteredId(false);
    }
  };

  const onCheckEmail = async email => {
    const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (!regex.test(email)) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: '이메일 형식을 지켜주세요.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const response = await emailCheckStudentApi(email);
    if (!response.data) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '이미 사용중인 이메일입니다.',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '사용가능한 이메일입니다.',
        showConfirmButton: false,
        timer: 1500,
      });
      setRegisteredEmail(false);
    }
  };

  const onInput = e => {
    const data = e.target.value;
    if (data.length === 3 && e.nativeEvent.data !== null) {
      e.target.value = `${data}-`;
    }
    if (data.length === 8 && e.nativeEvent.data !== null) {
      e.target.value = `${data}-`;
    }
  };

  return (
    <S.SignUpSection>
      <S.Header>사용자 회원가입</S.Header>

      <S.SignUpForm onSubmit={handleSubmit(onRegister)}>
        <S.Label htmlFor="name_helper">보호자 이름</S.Label>
        <S.Input
          {...register('name_helper', {
            required: '보호자 이름을 입력해주세요.',
            pattern: {
              value: /^[가-힣a-zA-Z]+$/,
              message: '정확한 이름을 입력해주세요.',
            },
            minLength: {
              value: 2,
              message: '정확한 이름을 입력해주세요.',
            },
          })}
          id="name_helper"
        />
        <S.ErrorMsg>
          {errors.name_helper && errors.name_helper.message}
        </S.ErrorMsg>
        <br />
        <S.Label htmlFor="name">아이 이름</S.Label>
        <S.Input
          {...register('name', {
            required: '아이 이름을 입력해주세요.',
            pattern: {
              value: /^[가-힣a-zA-Z]+$/,
              message: '정확한 이름을 입력해주세요.',
            },
            minLength: {
              value: 2,
              message: '정확한 이름을 입력해주세요.',
            },
          })}
          id="name"
        />
        <S.ErrorMsg>{errors.name && errors.name.message}</S.ErrorMsg>
        <br />
        <S.Label htmlFor="id">아이디</S.Label>
        <S.InputBox>
          <S.Input
            {...register('id', {
              required: '아이디를 입력해주세요',
              minLength: {
                value: 5,
                message: '최소 5자 이상의 아이디를 입력해주세요.',
              },
              maxLength: {
                value: 12,
                message: '12자 이하의 아이디만 사용가능합니다.',
              },
            })}
            id="id"
          />
          <S.RegisteredButton
            type="button"
            onClick={() => onCheckId(getValues('id'))}
          >
            중복확인
          </S.RegisteredButton>
        </S.InputBox>
        <S.ErrorMsg>{errors.id && errors.id.message}</S.ErrorMsg>
        <br />
        <S.Label htmlFor="password">비밀번호</S.Label>
        <S.Input
          id="password"
          type="password"
          placeholder="특수문자, 영문, 숫자를 혼용하여 8~16자를 입력해주세요."
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            pattern: {
              value:
                /(?=.*\d{1,50})(?=.*[~`!@#$%^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,16}$/,
              message: '특수문자, 영문, 숫자를 혼용하여 8~16자를 입력해주세요.',
            },
            minLength: {
              value: 8,
              message: '최소 8자 이상의 비밀번호를 입력해주세요.',
            },
            maxLength: {
              value: 16,
              message: '16자 이하의 비밀번호만 사용가능합니다.',
            },
          })}
        />
        <S.ErrorMsg>{errors.password && errors.password.message}</S.ErrorMsg>
        <br />
        <S.Label htmlFor="confirm_password">비밀번호 확인</S.Label>
        <S.Input
          id="confirm_password"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요."
          {...register('confirm_password', {
            required: '비밀번호를 입력해주세요.',
            validate: {
              matchsPreviousPassword: value => {
                const { password } = getValues();
                return password === value || '비밀번호가 일치하지 않습니다.';
              },
            },
          })}
        />
        <S.ErrorMsg>
          {errors.confirm_password && errors.confirm_password.message}
        </S.ErrorMsg>
        <br />
        <S.Label htmlFor="password_helper">2차 비밀번호</S.Label>
        <S.Input
          id="password_helper"
          type="password"
          placeholder="숫자 4자리를 입력해주세요."
          {...register('password_helper', {
            required: '비밀번호를 입력해주세요.',
            minLength: {
              value: 4,
              message: '최소 4자 이상의 비밀번호를 입력해주세요.',
            },
            maxLength: {
              value: 4,
              message: '4자 이하의 비밀번호만 사용가능합니다.',
            },
          })}
        />
        <S.ErrorMsg>
          {errors.password_helper && errors.password_helper.message}
        </S.ErrorMsg>
        <br />
        <S.Label htmlFor="emailId">이메일</S.Label>
        <S.InputBox>
          <S.Input
            {...register('email', {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '유효한 이메일이 아닙니다.',
              },
            })}
            placeholder="example@example.com"
            id="email"
            type="email"
          />
          <S.RegisteredButton
            type="button"
            onClick={() => onCheckEmail(getValues('email'))}
          >
            중복확인
          </S.RegisteredButton>
          <S.ErrorMsg>{errors.email && errors.email.message}</S.ErrorMsg>
        </S.InputBox>
        <br />
        <S.Label htmlFor="phone">휴대폰번호</S.Label>
        <S.Input
          {...register('phone', { required: '휴대폰번호를 입력해주세요.' })}
          id="phone"
          onChange={onInput}
          maxLength={13}
          placeholder="010-1234-5678"
        />
        <S.ErrorMsg>{errors.phone && errors.phone.message}</S.ErrorMsg>
        <br />
        <S.Label htmlFor="birth">생년월일</S.Label>
        <S.Input
          {...register('birth', { required: '생년월일을 입력해주세요.' })}
          id="birth"
          type="date"
        />
        <S.ErrorMsg>{errors.birth && errors.birth.message}</S.ErrorMsg>
        <S.SignUpButton type="submit">회원가입</S.SignUpButton>
      </S.SignUpForm>
    </S.SignUpSection>
  );
}

const S = {
  SignUpSection: styled.div`
    ${tw``}
  `,
  SignUpForm: styled.form`
    ${tw`mt-8`}
  `,
  Header: styled.h1`
    ${tw`font-extrabold text-2xl text-center pb-2 font-cafe24`}
  `,
  Label: styled.label`
    ${tw`font-extrabold text-xl text-center p-2`}
  `,
  Input: styled.input`
    ${tw`block w-full bg-transparent outline-none border-2 rounded-md py-2 px-4 mt-2 mb-2 placeholder-slate-400 focus:border-brand`}
  `,
  ErrorMsg: styled.p`
    ${tw`mb-3 text-red-400 text-sm font-bold`}
  `,
  InputBox: styled.div`
    ${tw`flex`}
  `,
  RegisteredButton: styled.button`
    ${tw`ml-3 text-lg bg-brand text-white hover:bg-brandHover m-1 rounded min-w-[100px]`}
  `,
  SignUpButton: styled.button`
    ${tw`bg-brand w-full mt-10 py-2 px-4 rounded-md text-xl font-cafe24 text-white hover:bg-brandHover`}
  `,
};
