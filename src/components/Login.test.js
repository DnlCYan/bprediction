import { render, screen } from "@testing-library/react";
import Login from "./Login";

test('check Login', async () => {
    let points = 5;
    const handleLoggedIn = jest.fn(() => console.log("mock was called"));

    const { container, getByText } = render(<Login onLoggedIn={handleLoggedIn} currentPoints={points} />);

    expect(getByText('If you what to save your points please Sign in below')).toBeInTheDocument();
    expect(screen.getByRole('button', {  name: /login with metamask/i})).toBeEnabled();

});