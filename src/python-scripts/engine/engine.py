from abc import ABCMeta, abstractmethod

class Engine(object):
    def __init__(self, builder):
        self.inject(builder)


    def inject(self, builder):
        self.builder = builder

    @abstractmethod
    def run(self):
        pass
