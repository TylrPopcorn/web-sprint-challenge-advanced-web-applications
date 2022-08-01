// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

import "@testing-library/jest-dom/extend-expect"

import Spinner from "./Spinner"
import { render, screen } from "@testing-library/react"

import React from 'react';

test('Spinner is on.', () => {
  // expect(true).toBe(true)

  render(<Spinner on={true} />)

  const msg = screen.getByText("Please wait...")
  expect(msg).toBeInTheDocument()

})



test('Spinner is off.', () => {
  // expect(true).toBe(true)

  render(<Spinner on={false} />)

  const msg = screen.queryByText("Please wait...")
  expect(msg).not.toBeInTheDocument()

})

//FindBy returns a promise.
