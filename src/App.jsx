import { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordStats: [] };
  }

  componentDidMount() {
    this.generateWordCloud();
  }

  componentDidUpdate() {
    this.generateWordCloud();
  }

  analyzeText = (textInput) => {
    const commonWords = new Set([
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "for",
      "with",
      "about",
      "as",
      "by",
      "to",
      "of",
      "from",
      "that",
      "which",
      "who",
      "whom",
      "this",
      "these",
      "those",
      "it",
      "its",
      "they",
      "their",
      "them",
      "we",
      "our",
      "ours",
      "you",
      "your",
      "yours",
      "he",
      "him",
      "his",
      "she",
      "her",
      "hers",
      "was",
      "were",
      "is",
      "am",
      "are",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "if",
      "each",
      "how",
      "what",
      "with",
      "without",
      "through",
      "over",
      "under",
      "above",
      "below",
      "between",
      "before",
      "after",
      "until",
      "off",
      "into",
      "by",
      "against",
      "hasn't",
      "hadn't",
      "didn't",
      "won't",
      "wouldn't",
      "can't",
      "couldn't",
      "shouldn't",
      "mustn't",
    ]);

    const wordsArray = textInput
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .split(/\s+/);

    const filteredWords = wordsArray.filter((word) => !commonWords.has(word));

    const wordFrequencyMap = filteredWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(wordFrequencyMap);
  };

  mergeFrequencies = (newFrequencies) => {
    const merged = [...this.state.wordStats];

    newFrequencies.forEach(([newWord, newFreq]) => {
      const existingWord = merged.find(([word]) => word === newWord);
      if (existingWord) {
        existingWord[1] += newFreq;
      } else {
        merged.push([newWord, newFreq]);
      }
    });

    const topWords = merged.sort((a, b) => b[1] - a[1]).slice(0, 5);

    this.setState({ wordStats: topWords });
  };

  generateWordCloud() {
    const wordData = this.state.wordStats;

    const width = 1000;
    const height = 150;
    const padding = 150;

    const svg = d3
      .select(".svg_parent")
      .attr("width", width)
      .attr("height", height);

    const sizeScale = d3
      .scaleLinear()
      .domain([d3.min(wordData, (d) => d[1]), d3.max(wordData, (d) => d[1])])
      .range([20, 70]);

    const xScale = d3
      .scaleLinear()
      .domain([0, wordData.length - 1])
      .range([padding, width - padding]);

    svg
      .selectAll("text")
      .data(wordData, (d) => d[0])
      .join(
        (enter) =>
          enter
            .append("text")
            .text((d) => d[0])
            .attr("font-size", 10)
            .attr("x", (d, i) => xScale(i))
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .style("opacity", 0)
            .transition()
            .duration(3000)
            .attr("font-size", (d) => `${sizeScale(d[1])}px`)
            .style("opacity", 1),
        (update) =>
          update
            .transition()
            .duration(2000)
            .attr("font-size", (d) => `${sizeScale(d[1])}px`)
            .attr("x", (d, i) => xScale(i))
            .style("opacity", 1),
        (exit) => exit.transition().duration(2000).style("opacity", 0).remove()
      );
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            id="text_area"
            style={{ height: 150, width: 1000 }}
            placeholder="Enter text to create a word cloud"
          />
          <button
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const text = document.getElementById("text_area").value;
              const newFrequencies = this.analyzeText(text);
              this.mergeFrequencies(newFrequencies);
            }}
          >
            Generate Word Cloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
