// put & delete

import {prisma} from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// put: update task by id
export async function PUT(
    request: NextRequest,
    {params}: {params: {id: string}}
) {
    try {
        const taskId = parseInt(params.id);
        const body = await request.json();
        const {title, description, completed} = body;

        // check if task exist 
        const existingTask = await prisma.task.findUnique({
            where: {taskId},
        })

        if (!existingTask || existingTask.deletedAt !== null){
            return NextResponse.json(
                {error: "Task not found"},
                {status: 404}
            );
        }

        // if existing task
        // check if fields are available
        const updateData: any = {};
        if (title !== "") updateData.title = title.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (completed !== undefined) updateData.completed = completed;
        const updateTask = await prisma.task.update({
            where: {taskId},
            updateData
        });
        return NextResponse.json(updateTask);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            {error: "Failed to update task."},
            {status: 500}
        )
    }
}


// delete: delete task by id
export async function DELETE(
    request: NextRequest,
    {params}: {params: {id:string}}
){
try {
    const taskId = parseInt(params.id);

    // check if task exist
        const existingTask = await prisma.task.findUnique({
        where: { taskId },
        });

        if (!existingTask || existingTask.deletedAt !== null) {
        return NextResponse.json(
            { error: "Task not found" },
            { status: 404 }
        );
        }

        // soft delete
        const deletedTask = await prisma.task.update({
        where: { taskId },
        data: { deletedAt: new Date() },
        });

        return NextResponse.json(deletedTask);
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 }
        );
    }
}