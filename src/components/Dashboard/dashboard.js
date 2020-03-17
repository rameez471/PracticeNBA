import React, { Component } from 'react';
import FormField from '../widgets/FormFields/formFields';
import './dashboard.css';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState,convertFromRaw,convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';  
import {firebase,firebaseTeams,firebaseArticles} from '../../firebase';
import Uploader from '../widgets/FileUploader/fileUploader';

class Dashboard extends Component {

    state={
        editorState:EditorState.createEmpty(),
        postError:'',
        loading:false,
        formData:{
            author:{
                element:'input',
                value:'',
                config:{
                    name:'author_input',
                    type:'text',
                    placeholder:'Enter your name'
                },
                validation:{
                    required:true,
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
            title:{
                element:'input',
                value:'',
                config:{
                    name:'title_input',
                    type:'text',
                    placeholder:'Enter the title'
                },
                validation:{
                    required:true,
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
            body:{
                element:'texteditor',
                value:'',
                valid:true
            },
            team:{
                element:'select',
                value:'',
                config:{
                    name:'teams_input',
                    options:[]
                },
                validation:{
                    required:true,
                },
                valid:false,
                touched:false,
                validationMessage:'' 
            },
            image:{
                element:'image',
                value:'',
                valid:true
            },
        }
    }

    componentDidMount(){
        this.loadTeams()
    }

    loadTeams=()=>{
        firebaseTeams.once('value')
        .then((snapshot)=>{
            let team=[];
            snapshot.forEach((childSnapshot)=>{
                team.push({
                    id:childSnapshot.val().teamId,
                    name:childSnapshot.val().city 
                })
            })
            const newFormData={...this.state.formData}
            const newElement={...newFormData['team']}

            newElement.config.options=team;
            newFormData['team']=newElement;

            this.setState({
                formData:newFormData
            })

        })
    }

    updateForm = (element,content = '') => {
        const newFormdata = {
            ...this.state.formData
        }
        const newElement = {
            ...newFormdata[element.id]
        }

        if(content === ''){
            newElement.value = element.event.target.value;
        } else {
            newElement.value = content
        }
        
        if(element.blur){
            let validData = this.validate(newElement);
            newElement.valid = validData[0];
            newElement.validationMessage = validData[1];   
        }
        newElement.touched = element.blur;
        newFormdata[element.id] = newElement;
        
        this.setState({
            formData:newFormdata
        })
    }

    validate=(element)=>{
        let error=[true,'']

       
        if(element.validation.required){
            const valid=element.value.trim()!=='';
            const message=`${!valid?'This field is required':''}`;
            error=!valid?[valid,message]:error
        }
        return error;
    }

    submitForm=(event)=>{
        event.preventDefault()
        let dataToSubmit={};
        let formIsValid=true;

        for(let key in this.state.formData){
            dataToSubmit[key]=this.state.formData[key].value;
        }

        for(let key in this.state.formData){
            formIsValid=this.state.formData[key].valid && formIsValid
        }

        console.log(dataToSubmit)

        if(formIsValid){
            this.setState({
                loading:true,
                postError:''
            })

            firebaseArticles.orderByChild('id')
            .limitToLast(1).once('value')
            .then(snapshot=>{
                let articleId=null;
                snapshot.forEach(childSnapshot=>{
                    articleId=childSnapshot.val().id 
                });
                
                dataToSubmit['date']=firebase.database.ServerValue.TIMESTAMP
                dataToSubmit['id']=articleId+1
                dataToSubmit['team']=parseInt(dataToSubmit['team'])

                firebaseArticles.push(dataToSubmit)
                .then(article=>{
                    this.props.history.push(`/articles/${article.key}`)
                }).catch(e=>{
                    this.setState({
                        postError:e.message
                    })
                })

            })

        }
        else{
            this.setState({
                postError:'Something went Wrong!!'
            })
        }

    }

    submitButton=()=>(
        this.state.loading ?
            'Loading...':
            <div>
                <button type='submit'>Add Post</button>
            </div>
    )

    showError=()=>(
        this.state.postError!==''?
        <div className='error'>{this.state.postError}</div>
        :
        ''
    )

    onEditorStateChange=(editorState)=>{

        let contentState=editorState.getCurrentContent();
        let rawState=convertToRaw(contentState)

        let html=stateToHTML(contentState)

        this.updateForm({id:'body'},html)

        this.setState({
            editorState
        })
    }

    storeFilename = (filename) => {
        this.updateForm({id:'image'},filename)
    }


    render() {
        return (
            <div className='postContainer'>
                <form onSubmit={this.submitForm}>
                    <h2>Add Post</h2>
                    <Uploader
                        filename={(filename)=>this.storeFilename(filename)}
                    />
                    <FormField
                        id={'author'}
                        formData={this.state.formData.author}
                        change={(element)=>this.updateForm(element)}
                    />
                    <FormField
                        id={'title'}
                        formData={this.state.formData.title}
                        change={(element)=>this.updateForm(element)}
                    />  
                    <Editor
                        editorState={this.state.editorState}
                        wrapperClassName="myEditor-wrapper"
                        editorClassName="myEditor-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />  
                    <FormField
                        id={'team'}
                        formData={this.state.formData.team}
                        change={(element)=>this.updateForm(element)}
                    />
                    {this.submitButton()}
                    {this.showError()}
                </form>
            </div>
        )
    }
}

export default Dashboard;