import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import wait from 'waait';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { ALL_PRODUCTS_QUERY } from '../components/Products';
import { fakeItem } from '../lib/testUtils';

const item = fakeItem();

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CreateProduct />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('handles the updating', async () => {
    // 1. render the form
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    // 2. type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);

    // note - userEvent.type APPENDS to existing field
    // default value for number input is 0 not '' - so have to clear otherwise end up with 05000
    const priceInput = screen.getByPlaceholderText(/price/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, item.price.toString());

    await userEvent.type(
      screen.getByPlaceholderText(/description/i),
      item.description
    );

    // 3. check the boxes are populated
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('creates the items when the form is submitted', async () => {
    // creates the mocks for this test
    const mocks = [
      {
        request: {
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            image: '',
            price: item.price,
          },
        },
        result: {
          data: {
            createProduct: {
              ...item,
              id: 'abc123',
              __typename: 'Item',
            },
          },
        },
      },
      {
        request: {
          query: ALL_PRODUCTS_QUERY,
          variables: { skip: 0, first: 2 },
        },
        result: {
          data: {
            allProducts: [item],
          },
        },
      },
    ];

    // render form
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );

    // type inputs
    await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);

    const priceInput = screen.getByPlaceholderText(/price/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, item.price.toString());

    await userEvent.type(
      screen.getByPlaceholderText(/description/i),
      item.description
    );

    // submit and check page change has been called
    await userEvent.click(screen.getByText(/add product/i));

    await waitFor(() => wait(0));
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({ pathname: '/product/abc123' });
  });
});
