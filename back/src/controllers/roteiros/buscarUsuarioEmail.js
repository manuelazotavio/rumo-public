import prisma from "../../config/prisma.js";

export const buscarUsuarioPorEmail = async (req, res) => {
    try {
        const { term } = req.query;
        if (!term) return res.status(400).json({});

        const termClean = term.replace(/\D/g, '');

        const orConditions = [
            { email: { equals: term, mode: 'insensitive' } }
        ];

        if (termClean.length > 0) {
            orConditions.push({ phone: { equals: termClean } });
        }

        const user = await prisma.user.findFirst({
            where: {
                status: 'ATIVO',
                OR: orConditions
            },
            select: { id: true, name: true, email: true, phone: true }
        });

        if (!user) return res.status(404).json({});

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno" });
    }
}