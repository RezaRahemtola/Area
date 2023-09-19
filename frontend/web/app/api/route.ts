import * as fs from "fs";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line import/prefer-default-export
// export async function GET() {
// 	// let res = Buffer.from("test");
// 	// try {
// 	// 	res = fs.readFileSync("public/app-debug.apk");
// 	// } catch (e) {
// 	// 	console.log(e);
// 	// }
// 	const res = fs.readdirSync("../");
//
// 	return NextResponse.json({ data: res });
// }

// eslint-disable-next-line
export async function GET(req: NextRequest) {
	const publicDir = `${__dirname.split(".next")[0]}public/uploads/`;
	const fileUrl = "app-debug.apk";
	try {
		const res = fs.readFileSync(publicDir + fileUrl);
		return NextResponse.json({ res });
	} catch (error) {
		return NextResponse.json({ data: error });
	}
}
