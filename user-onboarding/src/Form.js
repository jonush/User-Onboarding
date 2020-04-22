import React, { useState, useEffect } from 'react';
import "./App.css";
import axios from 'axios';
import * as yup from 'yup';

const url = 'https://reqres.in/api/users'

const formSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, 'Name must be at least 3 characters long.')
      .required('Please enter a name.'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter a email'),
    password: yup
      .string()
      .min(6, 'Password must contain at least 6 characters.')
      .required('Please enter a password.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, 'Password must contain at least one Uppercase, one Lowercase, and a Number'),
    terms: yup
      .boolean()
      .oneOf([true], 'Please accept the Terms and Conditions'),
})

function Form(props) {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        terms: '',
    })

    const [errors,setErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: '',
      })

    const [users, setUsers] = useState([]);
    const [formDisabled, setFormDisabled] = useState(true);

    useEffect(() => {
        formSchema.isValid(formValues)
          .then(valid => {
            setFormDisabled(!valid)
          })
      }, [formValues])

    const onInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        const checked = event.target.checked;

        event.persist();
        
        yup
            .reach(formSchema, name)
            .validate(value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [name]: ''
                })
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [name]: err.errors[0],
                })
            })
        
        setFormValues({
            ...formValues,
            [name]: event.target.type === 'checkbox' ? checked : value,
        });
    }

    const onSubmit = event => {
        event.preventDefault();
      
        axios.post(url, formValues)
            .then(res => {
                console.log('Data was posted');
                setUsers([...users, res.data]);

                setFormValues({
                    name: '',
                    email: '',
                    password: '',
                    terms: '',
                });
            })
            .catch(err => {
                console.log(err);
                debugger
            })
      }

    return (
        <div>

            <form className="form">
                <h2>Add a new user:</h2>

                <div className="errors">
                    {errors.name}
                    {errors.email}
                    {errors.password}
                    {errors.terms}
                </div>

                <label>
                    Name:&nbsp;
                    <input
                    name='name'
                    value={formValues.name}
                    onChange={onInputChange} />
                </label>

                <label>
                    Email:&nbsp;
                    <input
                    name='email'
                    value={formValues.email}
                    onChange={onInputChange} />
                </label>

                <label>
                    Password:&nbsp;
                    <input
                    name='password'
                    value={formValues.password}
                    onChange={onInputChange} />
                </label>

                <label>
                    <input
                    name='terms'
                    onChange={onInputChange}
                    value={formValues.terms}
                    type='checkbox' />
                    I agree to the Terms and Conditions
                </label>

                <button onClick={onSubmit} disabled={formDisabled}>Add User</button>
            </form>

            <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    );
  }
  
  export default Form;