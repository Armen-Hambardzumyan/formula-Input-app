import React, { useState, useEffect } from 'react';
import useStore from '../store';
import useSuggestions from '../useSuggestions';
import { evaluate } from 'mathjs';
import axios from 'axios';
import './FormulaInput.css'

const operators = ['+', '-', '*', '/', '(', ')', '^'];

const FormulaInput = () => {
  const { formula, setFormula } = useStore();
  const [inputValue, setInputValue] = useState('');
  const { data: suggestions = [] } = useSuggestions(inputValue);
  const [variables, setVariables] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const { data } = await axios.get('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
        setVariables(data);
      } catch (error) {
        console.error('Failed to fetch variables:', error);
      }
    };
    fetchVariables();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFormula(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      try {
        const parsedFormula = parseFormula(formula);
        const evalResult = evaluate(parsedFormula, variables.reduce((acc, curr) => {
          acc[curr.name] = curr.value;
          return acc;
        }, {}));
        setResult(evalResult);
      } catch (err) {
        console.error('Invalid formula', err);
      }
    }
  };

  const parseFormula = (formula) => {
    let parsed = formula;
    for (const variable of variables) {
      const regex = new RegExp(`\\b${variable.name}\\b`, 'g');
      parsed = parsed.replace(regex, variable.value);
    }
    return parsed;
  };

  const handleSelectSuggestion = (suggestion) => {
    if (operators.includes(suggestion.name)) {
      setFormula((prev) => `${prev}${suggestion.name}`);
      setInputValue('');
    } else {
      setFormula((prev) => `${prev}${suggestion.value}`);
      setInputValue(suggestion.name);
    }
  };

  return (
    <div className="formula-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter formula"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
      <div className="formula-display">
        Formula: {formula}
      </div>
      {result !== null && (
        <div className="result">
          Result: {result}
        </div>
      )}
    </div>
  );
};

export default FormulaInput;
