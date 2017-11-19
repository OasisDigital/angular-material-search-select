export class ODataUtils {
    public static convertObjectToString(obj: any): string {
        const properties: string[] = [];

        for (const prop in obj) {
            if (obj.hasOwnProperty(prop) && obj[prop] !== undefined) {
                const value: any = ODataUtils.quoteValue(obj[prop]);

                properties.push(`${prop}=${value}`);
            }
        }
        return properties.join(', ');
    }

    public static quoteValue(value: number | string | boolean): string {
        // check if string
        if (typeof value !== 'string') {
            return `${value}`;
        }

        // check if GUID (UUID) type
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
            return value;
        }

        const escaped = value.replace('\'', '\'\'');
        return `'${escaped}'`;
    }
}
