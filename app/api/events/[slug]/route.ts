import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'


// for slugs

type RouteParams = {
    params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {


    try {
        await connectDB();

        const { slug } = await params

        if (!slug || typeof slug != 'string' || slug.trim() == '') {
            return NextResponse.json({ message: 'Invalid or missing slug parameter' }, { status: 400 })
        }

        const cleanedSlug = slug.trim().toLowerCase();

        const event = await Event.findOne({ slug: cleanedSlug }).lean()
        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Event fetched successfully', event }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}