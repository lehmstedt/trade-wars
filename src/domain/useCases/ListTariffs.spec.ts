import { describe, expect, it } from "vitest";
import { CountryNotFoundError } from "@/domain/Errors";
import { ListTariffs } from "@/domain/useCases/ListTariffs";

describe("ListTariffs", () => {
    it("should throw when country is not existing", async () => {

        const listTariffs = new ListTariffs()
        await expect(() => listTariffs.execute()).rejects.toThrowError(CountryNotFoundError)

    })
})