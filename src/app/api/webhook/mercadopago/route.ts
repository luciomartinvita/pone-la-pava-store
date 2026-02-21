import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get('topic') || url.searchParams.get('type');
        const id = url.searchParams.get('id') || url.searchParams.get('data.id');

        console.log(`Webhook recibido: Topic=${topic}, ID=${id}`);

        if (topic === 'payment' || (topic === 'payment' && id)) {
            const payment = new Payment(client);
            const data = await payment.get({ id: String(id) });

            console.log("Datos del pago recibidos:", JSON.stringify(data, null, 2));

            // Aquí es donde actualizarías tu base de datos o enviarías un WhatsApp
            // Por ejemplo, si el estado es 'approved'
            if (data.status === 'approved') {
                console.log("¡Pago aprobado! Referencia externa:", data.external_reference);
                // TODO: Integrar con n8n o servicio de WhatsApp aquí
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error en Webhook de Mercado Pago:', error);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
    }
}
