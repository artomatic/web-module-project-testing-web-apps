import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render ( <ContactForm/>);
});

test('renders the contact form header', () => {
    render(<ContactForm/>);
    const header = screen.queryByText(/contact form/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const firstName = screen.getByPlaceholderText(/edd/i);

    userEvent.type(firstName, 'abc');
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render (<ContactForm/>);

    const submitButton = screen.getByText(/submit/i);
    userEvent.click(submitButton);

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render ( <ContactForm/>);

    userEvent.type(screen.getByPlaceholderText(/edd/i), 'Namee');
    userEvent.type(screen.getByPlaceholderText(/burke/i), 'LastName');

    userEvent.click(screen.getByText(/submit/i));

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render( <ContactForm/>);

    const emailInput = screen.getByText(/email*/i);
    userEvent.type(emailInput, 'invalidEmail');

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstName, 'George');

    const emailInput = screen.getByText(/email*/i);
    userEvent.type(emailInput, 'bloomtech@gmail.com');

    userEvent.click(screen.getByText(/submit/i));

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByPlaceholderText(/edd/i);
    const lastName = screen.getByPlaceholderText(/burke/i);
    const emailInput = screen.getByText(/email*/i);

    userEvent.type(firstName, 'George');  
    userEvent.type(lastName, 'Washington');
    userEvent.type(emailInput, 'foundingFather@gmail.com');

    userEvent.click(screen.getByText(/submit/i));

    await waitFor( () => {
        const displayedFirstName = screen.queryByText(/george/i);
        const displayedLastName = screen.queryByText(/washington/i);
        const displayedEmail = screen.queryByText(/foundingFather@gmail.com/i);
        const displayedMessage = screen.queryByText(/message:/i);

        expect(displayedFirstName).toBeInTheDocument();
        expect(displayedLastName).toBeInTheDocument();
        expect(displayedEmail).toBeInTheDocument();
        expect(displayedMessage).not.toBeInTheDocument(); 
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByPlaceholderText(/edd/i);
    const lastName = screen.getByPlaceholderText(/burke/i);
    const emailInput = screen.getByText(/email*/i);
    const messageInput = screen.getByText(/message/i);
    const submitButton = screen.getByRole('button');

    userEvent.type(firstName, 'George');  
    userEvent.type(lastName, 'Washington');
    userEvent.type(emailInput, 'foundingFather@gmail.com');
    userEvent.type(messageInput, 'Hello World!');

    userEvent.click(submitButton);

    await waitFor( () => {
        const displayedFirstNames = screen.queryByText(/george/i);
        const displayedLastNames = screen.queryByText(/washington/i);
        const displayedEmails = screen.queryByText(/foundingFather@gmail.com/i);
        const displayedMessage = screen.queryByText(/hello world!/i);

        expect(displayedFirstNames).toBeInTheDocument();
        expect(displayedLastNames).toBeInTheDocument();
        expect(displayedEmails).toBeInTheDocument();
        expect(displayedMessage).toBeInTheDocument(); 
    });
});
