import React, { Component } from 'react';
import './signin.css';
import FormField from '../widgets/FormFields/formFields';
import {firebase} from '../../firebase'

export default class Signin extends Component {

    state={
        registerError:'',
        loading:false,
        formData:{
            email:{
                element:'input',
                value:'',
                config:{
                    name:'email_input',
                    type:'email',
                    placeholder:'Enter your Email'
                },
                validation:{
                    required:true,
                    email:true
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
            password:{
                element:'input',
                value:'',
                config:{
                    name:'password_input',
                    type:'password',
                    placeholder:'Enter your password'
                },
                validation:{
                    required:true,
                    password:true
                },
                valid:false,
                touched:false,
                validationMessage:''
            }
        }
    }

    updateForm=(element)=>{
        const newFormData={
            ...this.state.formData
        }
        const newElements={
            ...newFormData[element.id]
        }
        newElements.value=element.event.target.value;

        if(element.blur){
            let validData=this.validate(newElements);
            newElements.valid=validData[0];
            newElements.validationMessage=validData[1]
        }

        newElements.touched=element.blur;

        newFormData[element.id]=newElements;
        this.setState({
            formData:newFormData
        })
    }

    validate=(element)=>{
        let error=[true,'']

        if(element.validation.email){
            const valid=/\S+@\S+\.\S+/.test(element.value);
            const message=`${!valid?'Must be a valid email':''}`;
            error=!valid?[valid,message]:error
        }

        if(element.validation.password){
            const valid=element.value.length>=5
            const message=`${!valid?'Must be greater than 5':''}`;
            error=!valid?[valid,message]:error
        }

        if(element.validation.required){
            const valid=element.value.trim()!=='';
            const message=`${!valid?'This field is required':''}`;
            error=!valid?[valid,message]:error
        }
        return error;
    }

    submitButton=()=>(
        this.state.loading ?
            'Loading...':
            <div>
                <button onClick={(event)=>this.submitForm(event,false)}>Register Now</button>
                <button onClick={(event)=>this.submitForm(event,true)}>Log In</button>
            </div>
    )

    submitForm=(event,type)=>{
        event.preventDefault();
        if(type!==null){
            let dataToSubmit={};
            let formIsValid=true;

            for(let key in this.state.formData){
                dataToSubmit[key]=this.state.formData[key].value;
            }

            for(let key in this.state.formData){
                formIsValid=this.state.formData[key].valid && formIsValid
            }

            if(formIsValid){
                this.setState({
                    loading:true,
                    registerError:''
                })
                if(type){
                    firebase.auth().
                    signInWithEmailAndPassword(
                        dataToSubmit.email,
                        dataToSubmit.password
                    ).then(()=>{
                        this.props.history.push('/')
                    }).catch(error=>{
                        this.setState({
                            loading:false,
                            registerError:error.message
                        })
                    })
                }
                else{
                    firebase.auth()
                    .createUserWithEmailAndPassword(
                        dataToSubmit.email,
                        dataToSubmit.password
                    ).then(()=>{
                        this.props.history.push('/')
                    }).catch(error=>{
                        this.setState({
                            loading:false,
                            registerError:error.message
                        })
                    })
                }
            }

        }
    }

    showError=()=>(
        this.state.registerError!==''?
        <div className='error'>{this.state.registerError}</div>
        :
        ''
    )

    render() {
        return (
            <div className='logContainer'>
                <form onSubmit={(event)=>this.submitForm(event,null)}>
                    <h2>Register / Log In</h2>
                    <FormField
                        id={'email'}
                        formData={this.state.formData.email}
                        change={(element)=>this.updateForm(element)}
                    />

                    <FormField
                        id={'password'}
                        formData={this.state.formData.password}
                        change={(element)=>this.updateForm(element)}
                    />
                    
                    {this.submitButton()}
                    {this.showError()}
                </form>
            </div>
        )
    }
}
