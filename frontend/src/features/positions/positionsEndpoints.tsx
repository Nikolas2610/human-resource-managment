import { Position } from "@/types/positions/Position.type";
import { apiService } from "../api/apiService";
import { NewPosition } from "@/types/positions/NewPosition.type";
import { ExistingPosition } from "@/types/positions/ExistingPosition.type";

export const positionEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getPositions: builder.query<Position[], number>({
            query: (companyId: number) => `companies/${companyId}/positions`,
            providesTags: (result, _error, _arg) =>
                result ? ["Position"] : [],
        }),
        getPosition: builder.query<
            Position,
            { companyId: number; positionId: number }
        >({
            query: ({ companyId, positionId }) =>
                `companies/${companyId}/positions/${positionId}`,
            providesTags: (_result, _error, { positionId }) => [
                { type: "Position", id: positionId },
            ],
        }),
        createPosition: builder.mutation<void, NewPosition>({
            query: ({ companyId, position }) => ({
                url: `companies/${companyId}/positions`,
                method: "POST",
                body: position,
            }),
            invalidatesTags: [{ type: "Position" }],
        }),
        editPosition: builder.mutation<Position, ExistingPosition>({
            query: ({ companyId, position }) => ({
                url: `companies/${companyId}/positions/${position.id}`,
                method: "PUT",
                body: position,
            }),
            invalidatesTags: [{ type: "Position" }],
        }),
        deletePosition: builder.mutation<
            void,
            { companyId: number; positionId: number }
        >({
            query: ({ companyId, positionId }) => ({
                url: `companies/${companyId}/positions/${positionId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Position" }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPositionQuery,
    useGetPositionsQuery,
    useCreatePositionMutation,
    useEditPositionMutation,
    useDeletePositionMutation,
} = positionEndpoints;
