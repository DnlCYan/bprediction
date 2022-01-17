import { render, screen } from "@testing-library/react";
import Profile from "./Profile";

test('check Profile', async () => {
    let auth = {"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiZjQwZTY0OWQtNjY0Ny00NzcwLTliYWYtNTk1Zjc0NmQ0OGU5IiwicHVibGljQWRkcmVzcyI6IjB4YmViNWQ4MzNhZjdkMjYzZDA0NTEzM2MzMjkwMzhhY2Q5NWEyMDkyNiJ9LCJpYXQiOjE2NDIzODQ5OTJ9.ZZgBoKtTQgHezrBeKnUezxuq3Hz3ur1-EpP0M_8KgMQ"};
    const onLoggedOut = jest.fn(() => console.log("mock was called"));
    const onLoad = jest.fn(() => console.log("mock was called"));

    const { container, getByText } = render(<Profile auth={auth} onLoggedOut={onLoggedOut} onLoad={onLoad}/>);

    expect(screen.getByText(/my publicaddress is/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {  name: /logout/i})).toBeEnabled();

});