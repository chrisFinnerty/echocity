import { useEffect, useState, useContext } from 'react';
import Context from '../Context';
import { useNavigate, useParams } from 'react-router-dom';
import { Label, Input, Button, Form } from 'reactstrap';

const FormTemplate = ({ fields, title, buttonText, type, onSubmitHandler }) => {
    const {currentUser} = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formdata, setFormData] = useState({});

    useEffect(() => {
        if(currentUser) {
            setFormData(currentUser);
            console.log(currentUser);
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
            onSubmitHandler(formdata);
            console.log(`${title} successful!`);
            setFormData({});
            navigate('/');
        } catch(err){
            console.error(err);
        }
    };

    return (
        <div className='FormTemplate'>
            <h1>{title}</h1>
            <Form className='FormTemplate-form' onSubmit={handleSubmit}>
                <div className='FormTemplate-signup-container'>
                    {fields.map((field, idx) => (
                        <div className='FormTemplate-field' key={idx}>
                            <Label htmlFor={field.name}>{field.label}</Label>
                            {currentUser && (type === 'signup' || type === 'login') ?  
                                <Input 
                                    name={field.name}
                                    id={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    disabled={field.disabled}
                                    onChange={handleChange}
                                    value=""
                                />
                            : (
                                <Input 
                                    name={field.name}
                                    id={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
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
    )
}

export default FormTemplate;