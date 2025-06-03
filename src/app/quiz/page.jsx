"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map/map.jsx";
import { Quizprovider } from "@/context/QuizContext.js";

function App() {
  const array = [
    "Afghanistan", "Angola", "Albania", "United Arab Emirates", "Argentina",
    "Armenia", "Antarctica", "French Southern and Antarctic Lands", "Australia",
    "Austria", "Azerbaijan", "Burundi", "Belgium", "Benin", "Burkina Faso",
    "Bangladesh", "Bulgaria", "The Bahamas", "Bosnia and Herzegovina",
    "Belarus", "Belize", "Bermuda", "Bolivia", "Brazil", "Brunei", "Bhutan",
    "Botswana", "Central African Republic", "Canada", "Switzerland", "Chile",
    "China", "Ivory Coast", "Cameroon", "Democratic Republic of the Congo",
    "Republic of the Congo", "Colombia", "Costa Rica", "Cuba", "Northern Cyprus",
    "Cyprus", "Czech Republic", "Germany", "Djibouti", "Denmark",
    "Dominican Republic", "Algeria", "Ecuador", "Egypt", "Eritrea", "Spain",
    "Estonia", "Ethiopia", "Finland", "Fiji", "Falkland Islands", "France",
    "Gabon", "United Kingdom", "Georgia", "Ghana", "Guinea", "Gambia",
    "Guinea Bissau", "Equatorial Guinea", "Greece", "Greenland", "Guatemala",
    "French Guiana", "Guyana", "Honduras", "Croatia", "Haiti", "Hungary",
    "Indonesia", "India", "Ireland", "Iran", "Iraq", "Iceland", "Israel",
    "Italy", "Jamaica", "Jordan", "Japan", "Kazakhstan", "Kenya", "Kyrgyzstan",
    "Cambodia", "South Korea", "Kosovo", "Kuwait", "Laos", "Lebanon", "Liberia",
    "Libya", "Sri Lanka", "Lesotho", "Lithuania", "Luxembourg", "Latvia",
    "Morocco", "Moldova", "Madagascar", "Mexico", "Macedonia", "Mali", "Malta",
    "Myanmar", "Montenegro", "Mongolia", "Mozambique", "Mauritania", "Malawi",
    "Malaysia", "Namibia", "New Caledonia", "Niger", "Nigeria", "Nicaragua",
    "Netherlands", "Norway", "Nepal", "New Zealand", "Oman", "Pakistan",
    "Panama", "Peru", "Philippines", "Papua New Guinea", "Poland", "Puerto Rico",
    "North Korea", "Portugal", "Paraguay", "Qatar", "Romania", "Russia",
    "Rwanda", "Western Sahara", "Saudi Arabia", "Sudan", "South Sudan",
    "Senegal", "Solomon Islands", "Sierra Leone", "El Salvador", "Somaliland",
    "Somalia", "Republic of Serbia", "Suriname", "Slovakia", "Slovenia",
    "Sweden", "Swaziland", "Syria", "Chad", "Togo", "Thailand", "Tajikistan",
    "Turkmenistan", "East Timor", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Taiwan", "United Republic of Tanzania", "Uganda", "Ukraine", "Uruguay",
    "United States of America", "Uzbekistan", "Venezuela", "Vietnam", "Vanuatu",
    "West Bank", "Yemen", "South Africa", "Zambia", "Zimbabwe"
  ];

  const [countries, setCountries] = useState(array);
  const [country, setCountry] = useState(localStorage.getItem("currentCountry") || "India");
  const [options, setOptions] = useState(
    JSON.parse(localStorage.getItem("options")) || []
  );
  const [level, setLevel] = useState(
    Number(JSON.parse(localStorage.getItem("level"))) || 1
  );
  const [highLevel,setHighlevel] = useState(
    Number(JSON.parse(localStorage.getItem('highlevel'))) || 1
  );

  const getRandomCountry = (excluded = []) => {
    const filteredCountries = countries.filter(
      (c) => !excluded.includes(c)
    );
    const randomIndex = Math.floor(Math.random() * filteredCountries.length);
    return filteredCountries[randomIndex];
  };

  const checkForHighlevel= () => {
    if (level > highLevel){
      setHighlevel(level)
      localStorage.setItem('highlevel',level)
    }else{}
  }

  const generateOptions = (currentCountry) => {
    const correctCountry = currentCountry;
    const option1 = getRandomCountry([correctCountry]);
    const option2 = getRandomCountry([correctCountry, option1]);
    const option3 = getRandomCountry([correctCountry, option1, option2]);
    const optionsArray = [correctCountry, option1, option2, option3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }
    return optionsArray;
  };

  useEffect(() => {
    if (!options.length) {
      const newOptions = generateOptions(country);
      setOptions(newOptions);
      localStorage.setItem("options", JSON.stringify(newOptions));
    }
  }, [country]);

  const nextQuestion = () => {
    const randomCountry = getRandomCountry();
    setCountry(randomCountry);
    setCountries((prev) => prev.filter((c) => c !== randomCountry));

    const newOptions = generateOptions(randomCountry);
    setOptions(newOptions);

    localStorage.setItem("currentCountry", randomCountry);
    localStorage.setItem("options", JSON.stringify(newOptions));
  };

  const currentQuestion = () => {
    return country;
  };

  const isCorrect = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === country) {
      alert("Correct!");
      setLevel((prev) => prev + 1);
      localStorage.setItem('level',level + 1)
      nextQuestion();
    } else {
      alert("Wrong! Try again. correct answer was "+currentQuestion());
      checkForHighlevel();
      setLevel(1);
      localStorage.setItem('level',1)
      nextQuestion();
    }
  };

  return (
    <Quizprovider value={{ currentQuestion, isCorrect, nextQuestion }}>
      <div>
        <div>
          <h1>
            Guess The Highlighted Country
          </h1>
          <h1>
            Level : {level}
          </h1>
          <h1>
            Highest Level : {highLevel}
          </h1>
          <div className="mb-4">
            <Map country={currentQuestion()} />
          </div>
          <div>
            {options.map((opps) => (
              <div key={opps}>
                <button
                  value={opps}
                  onClick={isCorrect}
                >
                  {opps}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Quizprovider>
  );
}

export default App;

