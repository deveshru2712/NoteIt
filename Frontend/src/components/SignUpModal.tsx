import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../api/user_api";
import * as UserApi from "../api/user_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import stylesUtils from "../styles/utils.module.css";
import { useState } from "react";
import { ConflictError } from "../errors/http_error";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessfully: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessfully }: SignUpModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const onSubmit = async (credentials: SignUpCredentials) => {
    try {
      const newUser = await UserApi.signUp(credentials);
      onSignUpSuccessfully(newUser);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  };

  return (
    <>
      <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {errorText && <Alert variant="danger">{errorText}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TextInputField
              name="username"
              label="username"
              type="text"
              placeholder="Username"
              register={register}
              registerOption={{ required: "Required" }}
              error={errors.username}
            />

            <TextInputField
              name="email"
              label="email"
              type="email"
              placeholder="Email"
              register={register}
              registerOption={{ required: "Required" }}
              error={errors.email}
            />

            <TextInputField
              name="password"
              label="password"
              type="password"
              placeholder="Password"
              register={register}
              registerOption={{ required: "Required" }}
              error={errors.password}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className={stylesUtils.width100}
            >
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignUpModal;
