import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import App from './App';
import BaseAPI from './api/BaseAPI';
import UsersAPI from './api/UsersAPI.js';
import FavoritesAPI from './api/FavoritesAPI.js';
import TicketMasterAPI from './api/ticketmasterAPI.js';
import UserEventsAPI from './api/UserEventsAPI.js';


const mockTestData = {
    userId: 1,
    username: 'testUser',
    email: 'test@email.com',
    password: 'password',
    firstName: 'Test',
    lastName: 'User',
    state: 'CA',
    token: 'test-token',
    artistId: 'G5vYZbf3GhoU_'
}

const { userId, username, email, password, firstName, lastName, state, token, artistId } = mockTestData;

vi.mock("./api/UsersAPI", () => ({
    default : {
        authenticate: vi.fn(() => Promise.resolve({
            token,
            user: { userId, firstName, lastName, state }
        })),
        logout: vi.fn(() => Promise.resolve()),
        signup: vi.fn(() => Promise.resolve({
            token,
            user: { userId, firstName, lastName, state }
        })),
        login: vi.fn(() => Promise.resolve({
            token,
            user: { userId, firstName, lastName, state }
        })),
        editUserProfile: vi.fn(() => Promise.resolve({
            userId, firstName, lastName, state
        })),
    }
}));

vi.mock("./api/FavoritesAPI", () => ({
    default:{
        getAllFavoriteArtists: vi.fn(() => Promise.resolve([
            { artistId }
        ]
        )),
    }
}));

vi.mock("./api/ticketmasterAPI", () => ({
    default:{
        getArtist: vi.fn(() => Promise.resolve({
            id: artistId,
            name: 'Artist',
            genre: "Rock",
            subgenre: "Alt",
            url: "https://www.google.com",
            imageURL: 'test-image.jpg'
        })),
        getEventsByArtistId: vi.fn(() => Promise.resolve([{
            eventId: 'test-event-id',
            venueName: 'Test Venue',
            eventDate: '2025-03-01',
            city: 'Test City',
            state: 'CA'
        }])),
        getEvents: vi.fn(() => Promise.resolve([
            {
                eventId: "gjkLmnop1234",
                eventName: "testEventName",
                url: "https://www.google.com"
            }
        ]))
    }
}));

vi.mock("./api/UserEventsAPI", () => ({
    default:{
        getAllUserEvents: vi.fn(() => Promise.resolve([
            {
                eventId: "gjkLmnop1234",
                eventName: "testEventName"
            }
    ]))
    }
}));

describe('App Component', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing and handles API auth', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        const mainElement = await waitFor(() => screen.getByTestId('app-container'));
        expect(mainElement).toBeInTheDocument();

        expect(UsersAPI.authenticate).toHaveBeenCalledTimes(1);
    });

    it("renders home page after user logs in", async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('home-container')).toBeInTheDocument();
        }, { timeout: 3000 });

        expect(UsersAPI.authenticate).toHaveBeenCalledTimes(1);
        expect(FavoritesAPI.getAllFavoriteArtists).toHaveBeenCalledTimes(1);
        expect(TicketMasterAPI.getArtist).toHaveBeenCalledTimes(1);
        expect(TicketMasterAPI.getEventsByArtistId).toHaveBeenCalledTimes(1);
        expect(BaseAPI.token).toBe("test-token");
    });

    it("renders event list with a user logged in", async() => {
        render(
            <MemoryRouter initialEntries={['/concerts']}>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('events-container')).toBeInTheDocument();
        });

        expect(TicketMasterAPI.getEvents).toHaveBeenCalledTimes(1);
        expect(FavoritesAPI.getAllFavoriteArtists).toHaveBeenCalledTimes(1);
        expect(UserEventsAPI.getAllUserEvents).toHaveBeenCalledTimes(1);
    });
});