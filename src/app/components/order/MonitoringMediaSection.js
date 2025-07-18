import { useContext, useEffect, useState } from "react";
import { DataContext } from "src/app/pages/context/DataContext";
import moment from "moment";

const MonitoringMediaSection = ({ data: dataSaved, isReadOnly, onChange }) => {
    const {
        createOrderDetails, setCreateOrderDetails,
        checkedValues, setCheckedValues,
        values, setValues,
        totalFee, setTotalFee,
        startDate, setStartDate,
        endDate, setEndDate,
        days, setDays,
        totalContractedValue, setTotalContractedValue
    } = useContext(DataContext);

    const [error, setError] = useState("");

    const notifyChange = (field, value) => {
        if (onChange && typeof onChange === 'function') {
            onChange(field, value);
        }
    };

    const getCurrentValue = (field) => {
        if (dataSaved && dataSaved[field] !== undefined) {
            return dataSaved[field];
        }

        switch (field) {
            case 'VIGENCIA DESDE':
                return startDate || '';
            case 'VIGENCIA HASTA':
                return endDate || '';
            case 'Total_Dias':
                return days || 0;
            case 'VALOR PACTADO':
                return totalContractedValue || 0;
            default:
                if (field.startsWith('VALOR ')) {
                    const mediaType = field.replace('VALOR ', '').toLowerCase();
                    return values[mediaType.toUpperCase()] || '0';
                }
                return '';
        }
    };

    const getCurrentCheckedValues = () => {
        if (isReadOnly && dataSaved) {
            const currentChecked = {};
            ["IMPRESOS", "RADIO", "TELEVISION", "INTERNET", "ANALISIS", "SOCIAL"].forEach(item => {
                const valor = dataSaved[`VALOR ${item.charAt(0).toUpperCase() + item.slice(1)}`];
                currentChecked[item] = valor && valor !== '0' && valor !== 0;
            });
            return currentChecked;
        }
        return checkedValues;
    };

    const fechaDesde = moment(getCurrentValue('VIGENCIA DESDE'), 'YYYY-MM-DD');
    const fechaHasta = moment(getCurrentValue('VIGENCIA HASTA'), 'YYYY-MM-DD');

    useEffect(() => {
        if (days < 0) {
            setError("La fecha Hasta no puede ser menor que la fecha Desde.");
        }
    }, [days]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        let dbFieldName = '';
        if (name === "Vigencia_Desde") {
            setStartDate(value);
            dbFieldName = 'VIGENCIA DESDE';
        } else if (name === "Vigencia_Hasta") {
            setEndDate(value);
            dbFieldName = 'VIGENCIA HASTA';
        }

        notifyChange(dbFieldName, value);

        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            setError("La fecha Hasta no puede ser menor que la fecha Desde.");
            setDays(0);
        } else {
            setError("");
        }

        if (!isReadOnly) {
            setCreateOrderDetails(prevDetails => ({
                ...prevDetails,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        const calculateDaysAndValues = () => {
            let calculatedDays = 0;
            const currentStartDate = getCurrentValue('VIGENCIA DESDE');
            const currentEndDate = getCurrentValue('VIGENCIA HASTA');

            if (currentStartDate && currentEndDate) {
                const start = new Date(currentStartDate);
                const end = new Date(currentEndDate);

                const diffTime = end - start;
                calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                setDays(calculatedDays);
                notifyChange('Total_Dias', calculatedDays);

                if (!isReadOnly) {
                    setCreateOrderDetails(prevDetails => ({
                        ...prevDetails,
                        Total_Dias: calculatedDays
                    }));
                }
            }

            let totalValues = 0;
            const currentCheckedValues = getCurrentCheckedValues();

            for (const key in currentCheckedValues) {
                if (currentCheckedValues[key]) {
                    const rawValue = getCurrentValue(`VALOR ${key.charAt(0).toUpperCase() + key.slice(1)}`) || "0";
                    const cleanValue = String(rawValue).replace(/\./g, '');
                    const numericValue = Number(cleanValue);
                    totalValues += numericValue;
                }
            }

            const totalFeeMonthly = totalValues;
            const totalContracted = totalValues;

            setTotalFee(totalFeeMonthly);
            setTotalContractedValue(totalContracted);
            notifyChange('VALOR PACTADO', totalContracted);

            if (!isReadOnly) {
                setCreateOrderDetails(prevDetails => ({
                    ...prevDetails,
                    Total_Valor: totalFeeMonthly,
                    Total_Valor_Dias: totalContracted
                }));
            }
        };

        calculateDaysAndValues();
    }, [startDate, endDate, checkedValues, values, days, isReadOnly, setCreateOrderDetails, dataSaved]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('createOrderDetails', JSON.stringify(createOrderDetails));
        }
    }, [createOrderDetails]);

    const formatCurrency = (value) => {
        const valueString = value ? String(value) : "0";
        const numberValue = parseFloat(valueString.replace(/\./g, '').replace(',', '.'));
        return isNaN(numberValue) ? '0' : numberValue.toLocaleString('es-CO');
    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;

        let cleanValue = value.replace(/\./g, '');
        cleanValue = cleanValue === "0" ? "" : cleanValue;
        const formattedValue = cleanValue !== "" ? Number(cleanValue).toLocaleString('es-CO') : "0";

        setValues((prevValues) => ({
            ...prevValues,
            [name]: formattedValue,
        }));

        const dbFieldName = `VALOR ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        notifyChange(dbFieldName, formattedValue);

        setCreateOrderDetails((prevDetails) => ({
            ...prevDetails,
            [dbFieldName]: formattedValue,
        }));
    };

    const handleCheckChange = (e) => {
        const { name, checked } = e.target;

        setCheckedValues((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (!checked) {
            const resetValue = "0";
            setValues((prevValues) => ({
                ...prevValues,
                [name]: resetValue,
            }));

            const dbFieldName = `VALOR ${name.charAt(0).toUpperCase() + name.slice(1)}`;
            notifyChange(dbFieldName, resetValue);

            setCreateOrderDetails((prevDetails) => ({
                ...prevDetails,
                [dbFieldName]: resetValue,
            }));
        }
    };

    return (
        <div className="w-full max-w-full">
            <div className="p-4 space-y-4">
                <h5 className="text-sm font-semibold text-gray-800 m-0">
                    MEDIOS A MONITOREAR (Valor fee mensual)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["IMPRESOS", "RADIO", "TELEVISION", "INTERNET", "ANALISIS", "SOCIAL"].map((item, index) => (
                        <div key={index} className="flex items-center justify-between border p-3 rounded-md">
                            <div className="flex items-center min-w-0 flex-1">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 bg-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 accent-blue-600"
                                    name={item}
                                    checked={getCurrentCheckedValues()[item] || false}
                                    onChange={(e) => handleCheckChange(e)}
                                    disabled={isReadOnly}
                                />
                                <span className="text-xs font-medium text-gray-700 ml-2 truncate">
                                    VALOR {item}
                                </span>
                            </div>
                            <input
                                type="text"
                                name={item}
                                value={formatCurrency(getCurrentValue(`VALOR ${item.charAt(0).toUpperCase() + item.slice(1)}`))}
                                onChange={(e) => handleValueChange(e)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-xs text-right ml-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                readOnly={isReadOnly}
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>

                <div className="border p-3 rounded-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700">
                                Vigencia Desde:
                            </label>
                            <input
                                type={isReadOnly ? "text" : "date"}
                                name="Vigencia_Desde"
                                value={isReadOnly ? fechaDesde.format('YYYY-MM-DD') : getCurrentValue('VIGENCIA DESDE')}
                                onChange={handleDateChange}
                                className="w-full px-2 py-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                readOnly={isReadOnly}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700">
                                Hasta:
                            </label>
                            <input
                                type={isReadOnly ? "text" : "date"}
                                name="Vigencia_Hasta"
                                value={isReadOnly ? fechaHasta.format('YYYY-MM-DD') : getCurrentValue('VIGENCIA HASTA')}
                                onChange={handleDateChange}
                                className="w-full px-2 py-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                readOnly={isReadOnly}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700">
                                Días:
                            </label>
                            <input
                                type="number"
                                value={isReadOnly ? fechaHasta.diff(fechaDesde, 'days') + 1 : getCurrentValue('Total_Dias')}
                                readOnly
                                className="w-full px-2 py-2 border border-gray-300 rounded text-xs bg-gray-100"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-2 text-red-500 text-xs bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border p-3 rounded-md">
                    <span className="text-xs font-medium text-gray-700">
                        Valor Total Contratado
                    </span>
                    <input
                        type="text"
                        value={formatCurrency(getCurrentValue('VALOR PACTADO'))}
                        readOnly
                        className="w-24 px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 text-right text-xs ml-3"
                    />
                </div>
            </div>
        </div>
    );
};

export default MonitoringMediaSection;