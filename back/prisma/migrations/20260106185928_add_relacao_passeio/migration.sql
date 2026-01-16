-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_passeioId_fkey" FOREIGN KEY ("passeioId") REFERENCES "passeio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
