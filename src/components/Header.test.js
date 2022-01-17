import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

test('check correct balance', async () => {
    let title = 'Game Testing';

    const { container, getByText } = render(<Header title={title}/>);

    expect(getByText(title)).toBeInTheDocument();

});