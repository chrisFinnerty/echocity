import { useEffect, useState, useContext } from 'react';
import Context from '../Context';
import { useNavigate } from 'react-router-dom';
import { Label, Input, Button, Form } from 'reactstrap';
import usStates from '../../../helpers/usStates';
import './FormTemplate.css';

const FormTemplate = ({ fields, title, buttonText, type, onSubmitHandler }) => {
    const {currentUser} = useContext(Context);
    const navigate = useNavigate();
    const [formdata, setFormData] = useState({});

    if(type === 'signup'){
        document.title = "Echocity | Sign Up"
    } else if(type === 'login'){
        document.title = "Echocity | Login"
    } else if(type === 'profileEdit'){
        document.title = `${currentUser.username} - Edit Profile`
    }

    useEffect(() => {
        if(currentUser) {
            setFormData(currentUser);
        } else {
            setFormData({});
        }
    }, [currentUser]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData((data) => ({
            ...data,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        try{
            const emptyFields = fields.filter(f => f.required && !formdata[f.name]);
            if(emptyFields.length > 0){
                alert("Pleae fill in all required fields.");
                return
            };

            onSubmitHandler(formdata);
            setFormData({});
            navigate('/');
        } catch(err){
            console.error(err);
        }
    };

    return (
        <div className='FormTemplate'>
            <Form className='FormTemplate-form' onSubmit={handleSubmit}>
                <div className='FormTemplate-signup-container'>
                    <h1>{title}</h1>
                    {fields.map((field, idx) => (
                        <div className='FormTemplate-field' key={idx}>
                            <Label htmlFor={field.name}>{field.label}</Label>
                            {field.name === 'state' ? (
                                <select
                                    name={field.name}
                                    id={field.name}
                                    required
                                    onChange={handleChange}
                                    value={formdata[field.name] || ""}
                                >
                                    <option value="">Select a state</option>
                                    {usStates.map(s => (
                                        <option key={s.name} value={s.abbreviation}>
                                            {s.abbreviation}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Input 
                                    name={field.name}
                                    id={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    disabled={field.disabled}
                                    onChange={handleChange}
                                    value={formdata[field.name] || ""}
                                />
                            )}
                        </div>
                    ))}
                    <Button>{buttonText}</Button>
                </div>
            </Form>
        </div>
    );
}

export default FormTemplate;