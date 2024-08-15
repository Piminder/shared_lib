enum SERVICE {
	AUTHENTICATIOIN = "auth",
	PRODUCT = "product",
	NOTIFICATION = "notification",
	CREDIT = "credit",
}

interface HOST {
	SERVICE: SERVICE;
	PATH: string;
}

function host({ SERVICE, PATH }: HOST): string {
	let p = 0;
	if (SERVICE === "auth") p = 3000;
	else if (SERVICE === "credit") p = 3002;
	else if (SERVICE === "product") p = 3003;
	else if (SERVICE === "notification") p = 3004;

	return `http://${SERVICE}:${p}/${PATH}`;
}

export { host, SERVICE, type HOST };
