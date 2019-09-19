# -*- coding: utf-8 -*-
from collections import namedtuple

import MeCab
from janome.tokenizer import Tokenizer
from abc import ABCMeta, abstractmethod

class TokenizerImpl(object):

    @abstractmethod
    def __init__(self, user_dic_path='', user_dic_enc='utf8'):
        super(TokenizerImpl, self).__init__()

    @abstractmethod
    def wakati(self, sent):
        pass

    @abstractmethod
    def wakati_baseform(self, sent):
        pass

    @abstractmethod
    def tokenize(self, sent):
        pass

    @abstractmethod
    def filter_by_pos(self, sent, pos=('名詞', )):
        pass
