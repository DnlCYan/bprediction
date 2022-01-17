import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Balance from "./Balance";

test('check correct balance', async () => {
    let point = 5;

    const { container, getByText } = render(<Balance points={point} />);

    expect(getByText('Your points: ' + point)).toBeInTheDocument();

});