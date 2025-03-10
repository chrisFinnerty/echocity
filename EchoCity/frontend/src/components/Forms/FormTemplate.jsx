import { useEffect, useState, useContext } from 'react';
import Context from '../Context';
import { useNavigate } from 'react-router-dom';
import { Label, Input, Button, Form } from 'reactstrap';
import Loader from '../Loader/Loader';
import usStates from '../../../helpers/usStates';
import './FormTemplate.css';

const FormTemplate = ({ fields, title, buttonText, type, onSubmitHandler, isSubmitting, error }) => {
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

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const emptyFields = fields.filter(f => f.required && !formdata[f.name]);
            if(emptyFields.length > 0){
                alert("Pleae fill in all required fields.");
                return
            };
            const res = await onSubmitHandler(formdata);
            if(res){
                setFormData({});
                navigate('/');
            };
        } catch(err){
            console.error(err);
            throw err;
        }
    };

    return (
        <div className='FormTemplate'>
            {isSubmitting && !error && <Loader />}
            <Form className='FormTemplate-form' onSubmit={handleSubmit}>
                <div className='FormTemplate-signup-container'>
                    <h1>{title}</h1>
                    {error && <p className="error">{error}</p>}
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
                                <>
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
                                    {field.name === 'password' && <p><i>Passwords must be at least 8 characters long.</i></p>}
                            </>
                            )}
                        </div>
                    ))}
                    <Button disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : buttonText}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default FormTemplate;