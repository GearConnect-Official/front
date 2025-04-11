import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateEvent from "../../src/components/CreateEvent";
import { useAuth } from "../../src/context/AuthContext";
import eventService from "../../src/services/eventService";

jest.mock("../../src/context/AuthContext", () => ({ useAuth: jest.fn() }));

jest.mock("../../src/services/eventService", () => ({
  __esModule: true,
  default: {
    createEvent: jest.fn(),
  },
}));

describe("CreateEvent", () => {
  const mockOnCancel = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockUser = { id: "user-123" };

  beforeEach(() => {
    const mockedUseAuth = useAuth as jest.Mock;
    mockedUseAuth.mockReturnValue({ user: mockUser });
    jest.clearAllMocks();
  });

  it("renders correctly and allows navigation between steps", () => {
    const { getByText } = render(
      <CreateEvent onCancel={mockOnCancel} onSuccess={mockOnSuccess} />
    );

    expect(getByText("Next")).toBeTruthy();
    fireEvent.press(getByText("Next"));
    fireEvent.press(getByText("Next"));
    expect(getByText("Submit")).toBeTruthy();
  });

  it("shows error if name or location is missing on submit", async () => {
    const { getByText, getByTestId } = render(
      <CreateEvent onCancel={mockOnCancel} onSuccess={mockOnSuccess} />
    );

    // Aller jusqu'à la dernière étape
    fireEvent.press(getByText("Next"));
    fireEvent.press(getByText("Next"));

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(getByText("Event name is required")).toBeTruthy();
    });
  });

  it("submits successfully with valid data", async () => {
    const mockCreate = eventService.createEvent as jest.Mock;
    mockCreate.mockResolvedValue({ id: "event-456" });

    const { getByText, getByPlaceholderText } = render(
      <CreateEvent onCancel={mockOnCancel} onSuccess={mockOnSuccess} />
    );

    // Étape 1: Remplir les champs requis
    fireEvent.changeText(getByPlaceholderText("Event Name"), "Test Event");
    fireEvent.changeText(getByPlaceholderText("Location"), "Paris");

    // Aller jusqu’à l’étape 3
    fireEvent.press(getByText("Next"));
    fireEvent.press(getByText("Next"));

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
