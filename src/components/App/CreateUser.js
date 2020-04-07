import React, { Component } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  LinearProgress
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { auth } from '../../services/firebase';
import '../../styles/App/CreateUser.scss';
import { createUser } from '../../services';
import { toast } from 'react-toastify';

export default class CreateUserNew extends Component {
  state = {
    isLoading: false,
    submitted: false,
    firstName: null,
    firstNameErr: null,
    lastName: null,
    lastNameErr: null,
    email: null,
    emailErr: null,
    password: null,
    passwordErr: null,
    password2: null,
    password2Err: null
  };

  change = (event, field) => {
    this.setState(
      {
        [field]: event.target.value
      },
      () => {
        if (this.state.submitted) {
          this.validate();
        }
      }
    );
  };

  validate = () => {
    let validationPassed = true;
    const { firstName, lastName, email, password, password2 } = this.state;

    this.setState({
      firstNameErr: null,
      lastNameErr: null,
      emailErr: null,
      passwordErr: null,
      password2Err: null
    });

    if (!firstName) {
      validationPassed = false;
      this.setState({ firstNameErr: 'Please enter your first name.' });
    }
    if (!lastName) {
      validationPassed = false;
      this.setState({ lastNameErr: 'Please enter your last name.' });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      validationPassed = false;
      this.setState({ emailErr: 'Not a valid email' });
    }
    if (!password) {
      validationPassed = false;
      this.setState({ passwordErr: 'Please enter a password' });
    } else if (password.length < 8) {
      validationPassed = false;
      this.setState({
        passwordErr: 'Please enter a password atleast 8 characters long'
      });
    }
    if (!password2) {
      validationPassed = false;
      this.setState({ password2Err: 'Please confirm your password' });
    } else if (password2.length < 8) {
      validationPassed = false;
      this.setState({
        password2Err: 'Please enter a password atleast 8 characters long'
      });
    }
    return validationPassed;
  };

  onSumbit = async event => {
    const { email, password, firstName, lastName } = this.state;
    event.preventDefault();
    this.setState({ submitted: true });

    if (this.validate()) {
      this.setState({ isLoading: true });
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then(async cred => {
          let token = await cred.user.getIdToken(true);
          let uid = cred.user.uid;
          await createUser({ firstName, lastName, email, token, uid });
          this.props.history.push('/');
        })
        .catch(err => {
          let errorCode = err.code;
          let errorMessage = err.message;
          console.error(errorCode);
          console.error(errorMessage);
          toast.error(errorMessage);
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const {
      isLoading,
      firstNameErr,
      lastNameErr,
      emailErr,
      password,
      passwordErr,
      password2,
      password2Err
    } = this.state;
    return (
      <>
        {isLoading && <LinearProgress style={{ height: '5px' }} />}
        <Container component='main' maxWidth='sm'>
          <CssBaseline />
          <div className='paper-container'>
            <Avatar className='locked-out-icon'>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Create Quick Chess Acount
            </Typography>
            <form className='signup-form'>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete='name given-name'
                    name='firstName'
                    variant='outlined'
                    fullWidth
                    id='firstName'
                    label='First Name'
                    error={firstNameErr ? true : false}
                    autoFocus
                    onChange={e => this.change(e, 'firstName')}
                    helperText={firstNameErr}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='lastName'
                    label='Last Name'
                    name='lastName'
                    autoComplete='name family-name'
                    onChange={e => this.change(e, 'lastName')}
                    helperText={lastNameErr}
                    error={lastNameErr ? true : false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    onChange={e => this.change(e, 'email')}
                    helperText={emailErr}
                    error={emailErr ? true : false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='new-password'
                    helperText={passwordErr ? passwordErr : 'Password must be atleat 8 characters'}
                    error={passwordErr ? true : false}
                    onChange={e => this.change(e, 'password')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    name='password2'
                    label='Confirm Password'
                    type='password'
                    id='password2'
                    autoComplete='new-password'
                    error={password !== password2 || (password2Err ? true : false)}
                    onChange={e => this.change(e, 'password2')}
                    helperText={password !== password2 ? 'Passwords do not match.' : password2Err}
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className='submit-button'
                disabled={isLoading}
                onClick={this.onSumbit}
              >
                Sign Up
              </Button>
              <Grid container justify='flex-end'>
                <Grid item>
                    <Link href='/' variant='body2'>
                      Already have an account? Sign in
                    </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </>
    );
  }
}