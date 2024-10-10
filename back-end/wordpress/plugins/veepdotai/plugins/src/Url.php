<?php

namespace Orhanerday\OpenAi;

class Url
{
    private array $ai;

    public function __construct($engine)
    {
        if (strtolower($engine) == "mistral") {
            $this->ai = [
                "engine" => "mistral",
                "origin" => "https://api.mistral.ai",
                "api_version" => "v1"
            ];    
        } else {
            $this->ai = [
                "engine" => "openai",
                "origin" => "https://api.openai.com",
                "api_version" => "v1"
            ];
        }
    }

    public function getAiURL(): string
    {
        return $this->ai['origin'] . "/" . $this->ai['api_version'];
    }

    /**
     * @deprecated
     * @param string $engine
     * @return string
     */
    public function completionURL(string $engine): string
    {
        return $this->getAiURL() . "/engines/$engine/completions";
    }

    /**
     * @return string
     */
    public function completionsURL(): string
    {
        return $this->getAiURL() . "/completions";
    }

    /**
     *
     * @return string
     */
    public function editsUrl(): string
    {
        return $this->getAiURL() . "/edits";
    }

    /**
     * @param string $engine
     * @return string
     */
    public function searchURL(string $engine): string
    {
        return $this->getAiURL() . "/engines/$engine/search";
    }

    /**
     * @param
     * @return string
     */
    public function enginesUrl(): string
    {
        return $this->getAiURL() . "/engines";
    }

    /**
     * @param string $engine
     * @return string
     */
    public function engineUrl(string $engine): string
    {
        return $this->getAiURL() . "/engines/$engine";
    }

    /**
     * @param
     * @return string
     */
    public function classificationsUrl(): string
    {
        return $this->getAiURL() . "/classifications";
    }

    /**
     * @param
     * @return string
     */
    public function moderationUrl(): string
    {
        return $this->getAiURL() . "/moderations";
    }

    /**
     * @param
     * @return string
     */
    public function transcriptionsUrl(): string
    {
        return $this->getAiURL() . "/audio/transcriptions";
    }

    /**
     * @param
     * @return string
     */
    public function translationsUrl(): string
    {
        return $this->getAiURL() . "/audio/translations";
    }

    /**
     * @param
     * @return string
     */
    public function filesUrl(): string
    {
        return $this->getAiURL() . "/files";
    }

    /**
     * @param
     * @return string
     */
    public function fineTuneUrl(): string
    {
        return $this->getAiURL() . "/fine-tunes";
    }

    /**
     * @param
     * @return string
     */
    public function fineTuneModel(): string
    {
        return $this->getAiURL() . "/models";
    }

    /**
     * @param
     * @return string
     */
    public function answersUrl(): string
    {
        return $this->getAiURL() . "/answers";
    }

    /**
     * @param
     * @return string
     */
    public function imageUrl(): string
    {
        return $this->getAiURL() . "/images";
    }

    /**
     * @param
     * @return string
     */
    public function embeddings(): string
    {
        return $this->getAiURL() . "/embeddings";
    }

    /**
     * @param
     * @return string
     */
    public function chatUrl(): string
    {
        return $this->getAiURL() . "/chat/completions";
    }
}
