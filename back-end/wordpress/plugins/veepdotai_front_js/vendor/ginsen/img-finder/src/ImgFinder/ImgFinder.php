<?php

declare(strict_types=1);

namespace ImgFinder;

use ImgFinder\Service\RepositoryService;
use ImgFinder\Service\TranslatorService;

class ImgFinder
{
    private TranslatorService $translator;
    private RepositoryService $imgRepo;


    public function __construct(Config $config)
    {
        $this->translator = $config->translator();
        $this->imgRepo    = $config->repository();
    }


    public function search(RequestInterface $request): ResponseInterface
    {
        $request = $this->translator->translate($request);

        return $this->imgRepo->findImages($request);
    }


    /**
     * @return string[]
     */
    public function repositories(): iterable
    {
        return $this->imgRepo->names();
    }
}
